import {
  StateAbbr,
  AddressFormData,
} from "../interfaces/redtail-form.interface";
import { RedtailSettingsData } from "../interfaces/redtail-settings.interface";
import styles from "../styles/DataCleanupPage.module.scss";

export default function AddressFields(props) {
  const addresses: AddressFormData[] = props.streetAddresses;
  const dropdownData: RedtailSettingsData = props.dropdownData;

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
    <div className={styles.formColumnScroll}>
      {addresses
        ? addresses.map((obj, index) => (
            <div className={styles.formRow} key={obj.key}>
              <input
                className={styles.formSoloInputLong}
                type="text"
                name="streetAddress"
                value={obj.streetAddress || ""}
                onChange={props.handleArrChange(
                  index,
                  "streetAddresses",
                  obj.ID
                )}
              />
              <input
                className={styles.formSoloInputLong}
                type="text"
                name="secondaryAddress"
                value={obj.secondaryAddress || ""}
                onChange={props.handleArrChange(
                  index,
                  "streetAddresses",
                  obj.ID
                )}
              />
              <input
                className={styles.formSoloInput}
                type="text"
                name="city"
                value={obj.city || ""}
                onChange={props.handleArrChange(
                  index,
                  "streetAddresses",
                  obj.ID
                )}
              />
              <div>
                <select
                  className={styles.formSoloInputShort}
                  onChange={props.handleArrChange(
                    index,
                    "streetAddresses",
                    obj.ID
                  )}
                  name="state"
                  value={obj.state || ""}
                >
                  {states.map((obj, index) => (
                    <option key={index} value={obj.short}>
                      {obj.short}
                    </option>
                  ))}
                </select>
              </div>
              <input
                className={styles.formSoloInput}
                type="text"
                name="zip"
                value={obj.zip || ""}
                onChange={props.handleArrChange(
                  index,
                  "streetAddresses",
                  obj.ID
                )}
              />
              <div>
                <select
                  className={styles.formSoloInput}
                  onChange={props.handleArrChange(
                    index,
                    "streetAddresses",
                    obj.ID
                  )}
                  name="typeID"
                >
                  {dropdownData && dropdownData.addressTypes ? (
                    dropdownData.addressTypes.map((obj, index) => (
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
                  name="primaryStreet"
                  value=""
                  checked={obj.primaryStreet}
                  onChange={props.handleArrChange(
                    index,
                    "streetAddresses",
                    obj.ID
                  )}
                />
                <button
                  className={styles.deleteButton}
                  onClick={props.removeContactField("streetAddresses", index)}
                />
              </div>
            </div>
          ))
        : ""}
    </div>
  );
}
