import { EmailFormData } from "../interfaces/redtail-form.interface";
import { RedtailSettingsData } from "../interfaces/redtail-settings.interface";
import styles from "../styles/DataCleanupPage.module.scss";

export default function EmailFields(props) {
  const emails: EmailFormData[] = props.emails;
  const dropdownData: RedtailSettingsData = props.dropdownData;

  return (
    <div className={styles.formColumnScroll}>
      {emails
        ? emails.map((obj, index) => (
            <div className={styles.formRow} key={obj.key}>
              <input
                className={styles.formSoloInputLong}
                type="text"
                name="emailAddress"
                value={obj.emailAddress || ""}
                onChange={props.handleArrChange(
                  index,
                  "emailAddresses",
                  obj.ID
                )}
              />

              <div>
                <select
                  className={styles.formSoloInputShort}
                  onChange={props.handleArrChange(
                    index,
                    "emailAddresses",
                    obj.ID
                  )}
                  name="typeID"
                >
                  {dropdownData && dropdownData.emailTypes ? (
                    dropdownData.emailTypes.map((obj, index) => (
                      <option key={index} value={obj.id || ""}>
                        {obj.name || ""}
                      </option>
                    ))
                  ) : (
                    <option value=""></option>
                  )}
                </select>
              </div>

              <div className={styles.formRowEven}>
                <input
                  className={styles.formRadio}
                  type="radio"
                  name="primaryEmail"
                  checked={obj.primaryEmail}
                  onChange={props.handleArrChange(
                    index,
                    "emailAddresses",
                    obj.ID
                  )}
                />
                <button
                  className={styles.deleteButton}
                  onClick={props.removeContactField("emailAddresses", index)}
                />
              </div>
            </div>
          ))
        : ""}
    </div>
  );
}
