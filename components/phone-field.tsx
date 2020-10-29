import { PhoneFormData } from "../interfaces/redtail-form.interface";
import { RedtailSettingsData } from "../interfaces/redtail-settings.interface";
import styles from "../styles/DataCleanupPage.module.scss";

export default function PhoneFields(props) {
  const phones: PhoneFormData[] = props.phoneNumbers;
  const dropdownData: RedtailSettingsData = props.dropdownData;

  return (
    <div className={styles.formColumnScroll}>
      {phones
        ? phones.map((obj, index) => (
            <div className={styles.formRow} key={obj.key}>
              <input
                className={styles.formSoloInput}
                type="tel"
                name="phoneNumber"
                value={obj.phoneNumber || ""}
                onChange={props.handleArrChange(index, "phoneNumbers", obj.ID)}
              />
              <div>
                <select
                  className={styles.formSoloInputShort}
                  onChange={props.handleArrChange(
                    index,
                    "phoneNumbers",
                    obj.ID
                  )}
                  name="typeID"
                >
                  {dropdownData && dropdownData.phoneTypes ? (
                    dropdownData.phoneTypes.map((obj, index) => (
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
                  name="primaryPhone"
                  value=""
                  checked={obj.primaryPhone}
                  onChange={props.handleArrChange(
                    index,
                    "phoneNumbers",
                    obj.ID
                  )}
                />
                <button
                  className={styles.deleteButton}
                  onClick={props.removeContactField("phoneNumbers", index)}
                />
              </div>
            </div>
          ))
        : ""}
    </div>
  );
}
