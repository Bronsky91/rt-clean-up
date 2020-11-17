import { useEffect, useRef } from "react";
import { RedtailContactUpdate } from "../interfaces/redtail-contact-update.interface";
import { RedtailSettingsData } from "../interfaces/redtail-settings.interface";
import styles from "../styles/DataCleanupPage.module.scss";
import { createEmptyFormData } from "../utils/create-empty-form-data";
import { urlSchema } from "../utils/form-validation";

export default function UrlFields(props) {
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
      contact.urls?.length > prevContactState.urls?.length
    ) {
      const scrollHeight = parentRef.current.scrollHeight;
      const height = parentRef.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      parentRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  }, [contact]);

  return (
    <div ref={parentRef} className={styles.formColumnScroll}>
      {contact && contact.urls
        ? contact.urls.map((url, index) => {
            const validAddress: boolean = urlSchema.isValidSync(url);
            return (
              <div className={styles.formRow} key={url.key}>
                <input
                  className={`${styles.margined} ${styles.short}`}
                  type="text"
                  name="custom_type_title"
                  value={url.custom_type_title || ""}
                  onChange={props.handleArrChange(index, "urls", url.id)}
                  onFocus={props.handleArrChange(index, "urls", url.id, "")}
                />
                <div className={styles.invalidInputContainer}>
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
                    value={url.address || ""}
                    onChange={props.handleArrChange(index, "urls", url.id)}
                  />
                </div>

                <div>
                  <select
                    className={`${styles.margined} ${styles.short}`}
                    onChange={props.handleArrChange(index, "urls", url.id)}
                    name="url_type"
                    value={url.url_type}
                  >
                    {dropdownData && dropdownData.urlTypes ? (
                      dropdownData.urlTypes.map((urlType, index) => (
                        <option key={index} value={urlType.id || 0}>
                          {urlType.name || ""}
                        </option>
                      ))
                    ) : (
                      <option value={0}></option>
                    )}
                  </select>
                </div>

                <div
                  className={`${styles.margined} ${styles.centered} ${styles.extraShort}`}
                >
                  <button
                    className={styles.deleteButton}
                    onClick={props.removeContactField("urls", index)}
                  />
                </div>
              </div>
            );
          })
        : ""}
    </div>
  );
}
