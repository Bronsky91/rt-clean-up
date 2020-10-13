import styles from "../styles/DataCleanupPage.module.scss";

export default function PhoneFields(props) {
  return (
    <div className={styles.formColumnScroll}>
      {props.phoneNumbers.map((obj, index) => (
        <div className={styles.formRow} key={obj.key}>
          <input
            className={styles.formSoloInput}
            type="text"
            name="phoneNumber"
            value={obj.phoneNumber || ""}
            onChange={props.handleArrChange(index, "phoneNumbers", obj.recID)}
          />
          <input
            className={styles.formSoloInput}
            type="text"
            name="type"
            value={obj.typeID || ""}
            onChange={props.handleArrChange(index, "phoneNumbers", obj.recID)}
          />
          <input
            type="radio"
            name="primaryPhone"
            value=""
            checked={obj.primaryPhone}
            onChange={props.handleArrChange(index, "phoneNumbers", obj.recID)}
          />
        </div>
      ))}
    </div>
  );
}
