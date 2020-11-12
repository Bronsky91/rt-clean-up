import styles from "../styles/DataCleanupPage.module.scss";

export default function TextField(props) {
  return (
    <div className={styles.mergedField}>
      <label className={styles.mergedLabel}>{props.label}</label>
      <input
        className={styles.mergedInput}
        type="text"
        name={props.fieldName}
        onChange={props.handleChange}
        value={props.fieldValue}
      />
    </div>
  );
}
