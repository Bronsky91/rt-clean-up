import styles from "../styles/DataCleanupPage.module.scss";

export default function AddressFields(props) {
  return (
    <div className={styles.formColumnScroll}>
      {props.streetAddresses.map((obj, index) => (
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
          <input
            className={styles.formSoloInput}
            type="text"
            value={obj.typeID || ""}
            onChange={props.handleArrChange(
              index,
              "streetAddresses",
              obj.recID
            )}
          />
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
        </div>
      ))}
    </div>
  );
}
