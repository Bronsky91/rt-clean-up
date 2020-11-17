import { RedtailContactUpdate } from "../interfaces/redtail-contact-update.interface";
import { RedtailSettingsData } from "../interfaces/redtail-settings.interface";
import PhoneInput from "react-phone-input-2";
import styles from "../styles/DataCleanupPage.module.scss";
import { createEmptyFormData } from "../utils/create-empty-form-data";
import { useEffect, useRef } from "react";
import { isPhoneValid } from "../utils/form-validation";

export default function PhoneFields(props) {
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
      contact.phones?.length > prevContactState.phones?.length
    ) {
      const scrollHeight = parentRef.current.scrollHeight;
      const height = parentRef.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      parentRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  }, [contact]);

  return (
    <div ref={parentRef} className={styles.formColumnScroll}>
      {contact && contact.phones
        ? contact.phones.map((phone, index) => (
            <div className={styles.formRow} key={phone.key}>
              <div
                className={`${styles.thinMargin} ${styles.centered} ${styles.short}`}
              >
                <input
                  className={styles.radioInput}
                  type="radio"
                  name="is_primary_phone"
                  value=""
                  checked={phone.is_primary}
                  onChange={props.handleArrChange(index, "phones", phone.id)}
                />
              </div>
              <input
                className={`${styles.thinMargin} ${styles.short}`}
                type="text"
                name="custom_type_title"
                value={phone.custom_type_title}
                onChange={props.handleArrChange(index, "phones", phone.id)}
                onFocus={props.handleArrChange(index, "phones", phone.id, "")}
              />
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
                isValid={(value, country: any) => {
                  if (isPhoneValid(value, country?.dialCode)) {
                    return true;
                  } else {
                    return "Not valid";
                  }
                }}
              />
              <div>
                <select
                  className={`${styles.thinMargin} ${styles.short}`}
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
              <div
                className={`${styles.thinMargin} ${styles.centered} ${styles.extraShort}`}
              >
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
