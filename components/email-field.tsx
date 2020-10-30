import { EmailFormData } from "../interfaces/redtail-form.interface";
import { RedtailSettingsData } from "../interfaces/redtail-settings.interface";
import styles from "../styles/DataCleanupPage.module.scss";

export default function EmailFields(props) {
  const emails: EmailFormData[] = props.emails;
  const dropdownData: RedtailSettingsData = props.dropdownData;

  return (
    <div className={styles.formColumnScroll}>
      {emails
        ? emails.map((email, index) => (
            <div className={styles.formRow} key={email.key}>
              <input
                className={styles.formSoloInputLong}
                type="text"
                name="emailAddress"
                value={email.emailAddress || ""}
                onChange={props.handleArrChange(index, "emails", email.id)}
              />

              <div>
                <select
                  className={styles.formSoloInputShort}
                  onChange={props.handleArrChange(index, "emails", email.id)}
                  name="typeID"
                  value={email.typeID}
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
                  name="primaryEmail"
                  checked={email.primaryEmail}
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
