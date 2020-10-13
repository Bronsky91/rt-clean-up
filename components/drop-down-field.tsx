import styles from "../styles/DataCleanupPage.module.scss";

export default function DropDownField(props) {
  console.log(props.dropDownItems);
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
        {props.dropDownItems.map((obj, index) => (
          <option key={index} value={obj[props.optionValue] || ""}>
            {obj.[props.optionLabel] || ""}
          </option>
        ))}
      </select>
    </div>
  );
}
