import { StreetAddressFormData } from "../interfaces/redtail-form.interface";
import { RedtailSettingsData } from "../interfaces/redtail-settings.interface";
import styles from "../styles/DataCleanupPage.module.scss";

export default function AddressFields(props) {
  const addresses: StreetAddressFormData[] = props.streetAddresses;
  const dropdownData: RedtailSettingsData = props.dropdownData;
  return (
    <div className={styles.formColumnScroll}>
      {addresses
        ? addresses.map((obj, index) => (
            <div className={styles.formRow} key={obj.key}>
              <input
                className={styles.formSoloInput}
                type="text"
                name="streetAddress"
                value={obj.streetAddress || ""}
                onChange={props.handleArrChange(
                  index,
                  "streetAddresses",
                  obj.recID
                )}
              />
              <input
                className={styles.formSoloInput}
                type="text"
                name="secondaryAddress"
                value={obj.secondaryAddress || ""}
                onChange={props.handleArrChange(
                  index,
                  "streetAddresses",
                  obj.recID
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
                  obj.recID
                )}
              />
              <input
                className={styles.formSoloInput}
                type="text"
                name="state"
                value={obj.state || ""}
                onChange={props.handleArrChange(
                  index,
                  "streetAddresses",
                  obj.recID
                )}
              />
              <input
                className={styles.formSoloInput}
                type="text"
                name="zip"
                value={obj.zip || ""}
                onChange={props.handleArrChange(
                  index,
                  "streetAddresses",
                  obj.recID
                )}
              />
              <div>
                <select
                  className={styles.formSoloInput}
                  onChange={props.handleArrChange(
                    index,
                    "streetAddresses",
                    obj.recID
                  )}
                  name="typeID"
                >
                  {dropdownData && dropdownData.addressTypes ? (
                    dropdownData.addressTypes.map((obj, index) => (
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
                name="primaryStreet"
                value=""
                checked={obj.primaryStreet}
                onChange={props.handleArrChange(
                  index,
                  "streetAddresses",
                  obj.recID
                )}
              />
              <button
                onClick={props.removeContactField("streetAddresses", index)}
              >
                Trash
              </button>
            </div>
          ))
        : ""}
    </div>
  );
}
