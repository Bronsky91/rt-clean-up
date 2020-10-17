import styles from "../styles/DataCleanupPage.module.scss";

export default function DropDownField(props) {
  return (
    <div className={styles.formField}>
      <label className={styles.formLabel}>{props.label}</label>
      <select
        className={styles.formLabelledInput}
        onChange={props.handleChange}
        name={props.fieldName}
        value={props.fieldValue}
      >
        <option value=""></option>
        {props.dropDownItems
          ? props.dropDownItems.map((obj, index) => (
              <option key={index} value={obj.id || ""}>
                {obj.name || ""}
              </option>
            ))
          : ""}
      </select>
    </div>
  );
}
