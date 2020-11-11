import { useEffect, useRef } from "react";
import { RedtailContactUpdate } from "../interfaces/redtail-contact-update.interface";
import { RedtailSettingsData } from "../interfaces/redtail-settings.interface";
import styles from "../styles/DataCleanupPage.module.scss";
import { createEmptyFormData } from "../utils/create-empty-form-data";

export default function EmailFields(props) {
  const emptyFormData: Readonly<RedtailContactUpdate> = createEmptyFormData();
  const parentRef = useRef(null);
  const prevContactRef = useRef(emptyFormData);
  const contact: RedtailContactUpdate = props.contact;
  const dropdownData: RedtailSettingsData = props.dropdownData;

  useEffect(() => {
    prevContactRef.current = contact;
  });
  const prevContactState = prevContactRef.current;

  // If child row is added, scroll to bottom
  useEffect(() => {
    if (
      contact &&
      prevContactState &&
      contact.contactRecord?.id === prevContactState.contactRecord?.id &&
      contact.emails?.length > prevContactState.emails?.length
    ) {
      const scrollHeight = parentRef.current.scrollHeight;
      const height = parentRef.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      parentRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  }, [contact]);

  return (
    <div ref={parentRef} className={styles.formColumnScroll}>
      {contact && contact.emails
        ? contact.emails.map((email, index) => (
            <div className={styles.formRow} key={email.key}>
              <input
                className={styles.formSoloInputLong}
                type="text"
                name="address"
                value={email.address || ""}
                onChange={props.handleArrChange(index, "emails", email.id)}
              />

              <div>
                <select
                  className={styles.formSoloInputShort}
                  onChange={props.handleArrChange(index, "emails", email.id)}
                  name="email_type"
                  value={email.email_type}
                >
                  {dropdownData && dropdownData.emailTypes ? (
                    dropdownData.emailTypes.map((emailType, index) => (
                      <option key={index} value={emailType.id || 0}>
                        {emailType.name || ""}
                      </option>
                    ))
                  ) : (
                    <option value={0}></option>
                  )}
                </select>
              </div>

              <div className={styles.formRowEven}>
                <input
                  className={styles.formRadio}
                  type="radio"
                  name="is_primary_email"
                  checked={email.is_primary}
                  onChange={props.handleArrChange(index, "emails", email.id)}
                />
                <button
                  className={styles.deleteButton}
                  onClick={props.removeContactField("emails", index)}
                />
              </div>
            </div>
          ))
        : ""}
    </div>
  );
}
