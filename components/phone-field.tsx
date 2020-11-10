import { PhoneUpdate } from "../interfaces/redtail-contact-update.interface";
import { RedtailSettingsData } from "../interfaces/redtail-settings.interface";
import PhoneInput from "react-phone-input-2";
import styles from "../styles/DataCleanupPage.module.scss";

export default function PhoneFields(props) {
  const phones: PhoneUpdate[] = props.phones;
  const dropdownData: RedtailSettingsData = props.dropdownData;

  return (
    <div className={styles.formColumnScroll}>
      {phones
        ? phones.map((phone, index) => (
            <div className={styles.formRow} key={phone.key}>
              <PhoneInput
                containerClass={styles.phoneContainer}
                buttonClass={styles.phoneButton}
                inputClass={styles.phoneInput}
                dropdownClass={styles.phoneDropdown}
                preferredCountries={["us", "ca"]}
                placeholder={""}
                country={phone.country_code || "us"} // Using "us" instead of 1 here, as 1 does not correctly resolve to US flag when passed a new, empty phone number
                value={phone.number || ""}
                onChange={props.handlePhoneChange(index, "phones", phone.id)}
              />
              <div>
                <select
                  className={styles.formSoloInputShort}
                  onChange={props.handleArrChange(index, "phones", phone.id)}
                  name="phone_type"
                  value={phone.phone_type}
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
                  name="is_primary_phone"
                  value=""
                  checked={phone.is_primary}
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
