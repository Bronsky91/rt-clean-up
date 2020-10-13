import styles from "../styles/DataCleanupPage.module.scss";

export default function TextField(props) {
  return (
    <div className={styles.formField}>
      <label className={styles.formLabel}>{props.label}</label>
      <input
        className={styles.formLabelledInput}
        type="text"
        name={props.fieldName}
        onChange={props.handleChange}
        value={props.fieldValue}
      />
    </div>
  );
}
