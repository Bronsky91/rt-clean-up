import { useEffect, useRef } from "react";
import { RedtailContactUpdate } from "../interfaces/redtail-contact-update.interface";
import { StateAbbr } from "../interfaces/redtail-settings.interface";
import { RedtailSettingsData } from "../interfaces/redtail-settings.interface";
import styles from "../styles/DataCleanupPage.module.scss";
import { createEmptyFormData } from "../utils/create-empty-form-data";
import {
  citySchema,
  stateSchema,
  streetAddressSchema,
  zipSchema,
} from "../utils/form-validation";

export default function AddressFields(props) {
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
      contact.addresses?.length > prevContactState.addresses?.length
    ) {
      const scrollHeight = parentRef.current.scrollHeight;
      const height = parentRef.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      parentRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  }, [contact]);

  const states: StateAbbr[] = [
    { long: "", short: "" },
    { long: "Alabama", short: "AL" },
    { long: "Alaska", short: "AK" },
    { long: "Arizona", short: "AZ" },
    { long: "Arkansas", short: "AR" },
    { long: "California", short: "CA" },
    { long: "Colorado", short: "CO" },
    { long: "Connecticut", short: "CT" },
    { long: "Delaware", short: "DE" },
    { long: "Florida", short: "FL" },
    { long: "Georgia", short: "GA" },
    { long: "Hawaii", short: "HI" },
    { long: "Idaho", short: "ID" },
    { long: "Illinois", short: "IL" },
    { long: "Indiana", short: "IN" },
    { long: "Iowa", short: "IA" },
    { long: "Kansas", short: "KS" },
    { long: "Kentucky", short: "KY" },
    { long: "Louisiana", short: "LA" },
    { long: "Maine", short: "ME" },
    { long: "Maryland", short: "MD" },
    { long: "Massachusetts", short: "MA" },
    { long: "Michigan", short: "MI" },
    { long: "Minnesota", short: "MN" },
    { long: "Mississippi", short: "MS" },
    { long: "Missouri", short: "MO" },
    { long: "Montana", short: "MT" },
    { long: "Nebraska", short: "NE" },
    { long: "Nevada", short: "NV" },
    { long: "New Hampshire", short: "NH" },
    { long: "New Jersey", short: "NJ" },
    { long: "New Mexico", short: "NM" },
    { long: "New York", short: "NY" },
    { long: "North Carolina", short: "NC" },
    { long: "North Dakota", short: "ND" },
    { long: "Ohio", short: "OH" },
    { long: "Oklahoma", short: "OK" },
    { long: "Oregon", short: "OR" },
    { long: "Pennsylvania", short: "PA" },
    { long: "Rhode Island", short: "RI" },
    { long: "South Carolina", short: "SC" },
    { long: "South Dakota", short: "SD" },
    { long: "Tennessee", short: "TN" },
    { long: "Texas", short: "TX" },
    { long: "Utah", short: "UT" },
    { long: "Vermont", short: "VT" },
    { long: "Virginia", short: "VA" },
    { long: "Washington", short: "WA" },
    { long: "West Virginia", short: "WV" },
    { long: "Wisconsin", short: "WI" },
    { long: "Wyoming", short: "WY" },
  ];

  return (
    <div ref={parentRef} className={styles.formColumnScroll}>
      {contact && contact.addresses
        ? contact.addresses.map((address, index) => {
            const validStreetAddress: boolean = streetAddressSchema.isValidSync(
              address
            );
            const validCity: boolean = citySchema.isValidSync(address);
            const validState: boolean = stateSchema.isValidSync(address);
            const validZip: boolean = zipSchema.isValidSync(address);
            return (
              <div className={styles.formRow} key={address.key}>
                <div
                  className={`${styles.margined} ${styles.centered} ${styles.short}`}
                >
                  <input
                    className={styles.radioInput}
                    type="radio"
                    name="is_primary_address"
                    value=""
                    checked={address.is_primary}
                    onChange={props.handleArrChange(
                      index,
                      "addresses",
                      address.id
                    )}
                  />
                </div>
                <input
                  className={`${styles.margined} ${styles.short}`}
                  type="text"
                  name="custom_type_title"
                  value={address.custom_type_title || ""}
                  onChange={props.handleArrChange(
                    index,
                    "addresses",
                    address.id
                  )}
                  onFocus={props.handleArrChange(
                    index,
                    "addresses",
                    address.id,
                    ""
                  )}
                />
                <div className={styles.invalidInputContainer}>
                  {validStreetAddress ? (
                    ""
                  ) : (
                    <div className={styles.invalidInputMessage}>Not valid</div>
                  )}
                  <input
                    className={`${styles.long} ${
                      validStreetAddress ? "" : styles.invalidInput
                    }`}
                    type="text"
                    name="street_address"
                    value={address.street_address || ""}
                    onChange={props.handleArrChange(
                      index,
                      "addresses",
                      address.id
                    )}
                  />
                </div>
                <input
                  className={`${styles.margined} ${styles.long}`}
                  type="text"
                  name="secondary_address"
                  value={address.secondary_address || ""}
                  onChange={props.handleArrChange(
                    index,
                    "addresses",
                    address.id
                  )}
                />
                <div className={styles.invalidInputContainer}>
                  {validCity ? (
                    ""
                  ) : (
                    <div className={styles.invalidInputMessage}>Not valid</div>
                  )}
                  <input
                    className={`${styles.medium} ${
                      validCity ? "" : styles.invalidInput
                    }`}
                    type="text"
                    name="city"
                    value={address.city || ""}
                    onChange={props.handleArrChange(
                      index,
                      "addresses",
                      address.id
                    )}
                  />
                </div>
                <div>
                  <div className={styles.invalidInputContainer}>
                    {validState ? (
                      ""
                    ) : (
                      <div className={styles.invalidInputMessage}>
                        Not valid
                      </div>
                    )}
                    <select
                      className={`${styles.short} ${
                        validState ? "" : styles.invalidInput
                      }`}
                      onChange={props.handleArrChange(
                        index,
                        "addresses",
                        address.id
                      )}
                      name="state"
                      value={address.state || ""}
                    >
                      {states.map((obj, index) => (
                        <option
                          key={index}
                          value={obj.short}
                          className={styles.dropdownOption}
                        >
                          {obj.short}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className={styles.invalidInputContainer}>
                  {validZip ? (
                    ""
                  ) : (
                    <div className={styles.invalidInputMessage}>Not valid</div>
                  )}
                  <input
                    className={`${styles.medium} ${
                      validZip ? "" : styles.invalidInput
                    }`}
                    type="text"
                    name="zip"
                    value={address.zip || ""}
                    onChange={props.handleArrChange(
                      index,
                      "addresses",
                      address.id
                    )}
                  />
                </div>
                <div>
                  <select
                    className={`${styles.margined} ${styles.short}`}
                    onChange={props.handleArrChange(
                      index,
                      "addresses",
                      address.id
                    )}
                    name="address_type"
                    value={address.address_type}
                  >
                    {dropdownData && dropdownData.addressTypes ? (
                      dropdownData.addressTypes.map((addressType, index) => (
                        <option key={index} value={addressType.id || 0}>
                          {addressType.name || ""}
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
                    onClick={props.removeContactField("addresses", index)}
                  />
                </div>
              </div>
            );
          })
        : ""}
    </div>
  );
}
