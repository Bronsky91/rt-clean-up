import styles from "../styles/DataCleanupPage.module.scss";

export default function EmailFields(props) {
  return (
    <div className={styles.formColumnScroll}>
      {props.emails.map((obj, index) => (
        <div className={styles.formRow} key={obj.key}>
          <input
            className={styles.formSoloInput}
            type="text"
            name="emailAddress"
            value={obj.emailAddress || ""}
            onChange={props.handleArrChange(index, "emailAddresses", obj.recID)}
          />
          <input
            className={styles.formSoloInput}
            type="text"
            name="type"
            value={obj.typeID || ""}
            onChange={props.handleArrChange(index, "emailAddresses", obj.recID)}
          />
          <input
            type="radio"
            name="primaryEmail"
            checked={obj.primaryEmail}
            onChange={props.handleArrChange(index, "emailAddresses", obj.recID)}
          />
        </div>
      ))}
    </div>
  );
}
