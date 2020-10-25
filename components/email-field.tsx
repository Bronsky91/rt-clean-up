import { EmailAddressFormData } from "../interfaces/redtail-form.interface";
import { RedtailSettingsData } from "../interfaces/redtail-settings.interface";
import styles from "../styles/DataCleanupPage.module.scss";

export default function EmailFields(props) {
  const emails: EmailAddressFormData[] = props.emails;
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
                  obj.recID
                )}
              />

              <div>
                <select
                  className={styles.formSoloInputShort}
                  onChange={props.handleArrChange(
                    index,
                    "emailAddresses",
                    obj.recID
                  )}
                  name="typeID"
                >
                  {dropdownData && dropdownData.internetTypes ? (
                    dropdownData.internetTypes.map((obj, index) => (
                      <option key={index} value={obj.TypeID || ""}>
                        {obj.Description || ""}
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
                    obj.recID
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
