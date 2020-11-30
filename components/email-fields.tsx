import { useEffect, useRef } from "react";
import { RedtailContactUpdate } from "../interfaces/redtail-contact-update.interface";
import { RedtailSettingsData } from "../interfaces/redtail-settings.interface";
import styles from "../styles/DataCleanupPage.module.scss";
import { createEmptyFormData } from "../utils/create-empty-form-data";
import { emailSchema } from "../utils/form-validation";

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
        ? contact.emails.map((email, index) => {
            const validAddress: boolean = emailSchema.isValidSync(email);
            return (
              <div className={styles.formRow} key={email.key}>
                <div
                  className={`${styles.thinMargin} ${styles.centered} ${styles.short}`}
                >
                  <input
                    className={styles.radioInput}
                    type="radio"
                    name="is_primary_email"
                    checked={email.is_primary}
                    onChange={props.handleArrChange(index, "emails", email.id)}
                  />
                </div>
                <input
                  className={`${styles.thinMargin} ${styles.short}`}
                  type="text"
                  name="custom_type_title"
                  value={email.custom_type_title || ""}
                  onChange={props.handleArrChange(index, "emails", email.id)}
                />
                <div
                  className={`${styles.invalidInputContainer} ${styles.thinMargin}`}
                >
                  {validAddress ? (
                    ""
                  ) : (
                    <div className={styles.invalidInputMessage}>Not valid</div>
                  )}
                  <input
                    className={`${styles.long} ${
                      validAddress ? "" : styles.invalidInput
                    }`}
                    type="text"
                    name="address"
                    value={email.address || ""}
                    onChange={props.handleArrChange(index, "emails", email.id)}
                  />
                </div>
                <div>
                  <select
                    className={`${styles.thinMargin} ${styles.short}`}
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
                <div
                  className={`${styles.thinMargin} ${styles.centered} ${styles.extraShort}`}
                >
                  <button
                    className={styles.deleteButton}
                    onClick={props.removeContactField("emails", index)}
                  />
                </div>
              </div>
            );
          })
        : ""}
    </div>
  );
}
