import { EmailUpdate } from "../interfaces/redtail-contact-update.interface";
import { RedtailSettingsData } from "../interfaces/redtail-settings.interface";
import styles from "../styles/DataCleanupPage.module.scss";

export default function EmailFields(props) {
  const emails: EmailUpdate[] = props.emails;
  const dropdownData: RedtailSettingsData = props.dropdownData;

  return (
    <div className={styles.formColumnScroll}>
      {emails
        ? emails.map((email, index) => (
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
