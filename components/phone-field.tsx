import { PhoneNumberFormData } from "../interfaces/redtail-form.interface";
import { RedtailSettingsData } from "../interfaces/redtail-settings.interface";
import styles from "../styles/DataCleanupPage.module.scss";

export default function PhoneFields(props) {
  const phones: PhoneNumberFormData[] = props.phoneNumbers;
  const dropdownData: RedtailSettingsData = props.dropdownData;

  return (
    <div className={styles.formColumnScroll}>
      {phones
        ? phones.map((obj, index) => (
            <div className={styles.formRow} key={obj.key}>
              <input
                className={styles.formSoloInput}
                type="text"
                name="phoneNumber"
                value={obj.phoneNumber || ""}
                onChange={props.handleArrChange(
                  index,
                  "phoneNumbers",
                  obj.recID
                )}
              />
              <div>
                <select
                  className={styles.formSoloInput}
                  onChange={props.handleArrChange(
                    index,
                    "phoneNumbers",
                    obj.recID
                  )}
                  name="typeID"
                >
                  {dropdownData && dropdownData.phoneTypes ? (
                    dropdownData.phoneTypes.map((obj, index) => (
                      <option key={index} value={obj.TypeID || ""}>
                        {obj.Description || ""}
                      </option>
                    ))
                  ) : (
                    <option value=""></option>
                  )}
                </select>
              </div>
              <input
                type="radio"
                name="primaryPhone"
                value=""
                checked={obj.primaryPhone}
                onChange={props.handleArrChange(
                  index,
                  "phoneNumbers",
                  obj.recID
                )}
              />
            </div>
          ))
        : ""}
    </div>
  );
}
