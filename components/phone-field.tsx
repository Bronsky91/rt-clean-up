import { PhoneFormData } from "../interfaces/redtail-form.interface";
import { RedtailSettingsData } from "../interfaces/redtail-settings.interface";
import styles from "../styles/DataCleanupPage.module.scss";

export default function PhoneFields(props) {
  const phones: PhoneFormData[] = props.phones;
  const dropdownData: RedtailSettingsData = props.dropdownData;

  return (
    <div className={styles.formColumnScroll}>
      {phones
        ? phones.map((phone, index) => (
            <div className={styles.formRow} key={phone.key}>
              <input
                className={styles.formSoloInput}
                type="tel"
                name="phoneNumber"
                value={phone.phoneNumber || ""}
                onChange={props.handleArrChange(index, "phones", phone.id)}
              />
              <div>
                <select
                  className={styles.formSoloInputShort}
                  onChange={props.handleArrChange(index, "phones", phone.id)}
                  name="typeID"
                  value={phone.typeID}
                >
                  {dropdownData && dropdownData.phoneTypes ? (
                    dropdownData.phoneTypes.map((phoneType, index) => {
                      return (
                        <option key={index} value={phoneType.id || 0}>
                          {phoneType.name || ""}
                        </option>
                      );
                    })
                  ) : (
                    <option value={0}></option>
                  )}
                </select>
              </div>
              <div className={styles.formRowEven}>
                <input
                  className={styles.formRadio}
                  type="radio"
                  name="primaryPhone"
                  value=""
                  checked={phone.primaryPhone}
                  onChange={props.handleArrChange(index, "phones", phone.id)}
                />
                <button
                  className={styles.deleteButton}
                  onClick={props.removeContactField("phones", index)}
                />
              </div>
            </div>
          ))
        : ""}
    </div>
  );
}
