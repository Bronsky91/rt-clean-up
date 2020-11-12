import styles from "../styles/DataCleanupPage.module.scss";
import { lastnameSchema, taxSchema } from "../utils/form-validation";

export default function TextField(props) {
  const isTaxID: boolean = props.fieldName === "tax_id";
  const isLastname: boolean = props.fieldName === "last_name";
  const validTaxID: boolean = isTaxID
    ? taxSchema.isValidSync({ tax_id: props.fieldValue })
    : false;
  const validLastname: boolean = isLastname
    ? lastnameSchema.isValidSync({ last_name: props.fieldValue })
    : false;

  return (
    <div className={styles.invalidInputContainer}>
      {(isTaxID && !validTaxID) || (isLastname && !validLastname) ? (
        <div className={styles.invalidInputMessage}>Not valid</div>
      ) : (
        ""
      )}
      <div className={styles.mergedField}>
        <label className={styles.mergedLabel}>{props.label}</label>
        <input
          className={`${styles.mergedInput} ${
            (isTaxID && !validTaxID) || (isLastname && !validLastname)
              ? styles.invalidInput
              : ""
          }`}
          type="text"
          name={props.fieldName}
          onChange={props.handleChange}
          value={props.fieldValue}
        />
      </div>
    </div>
  );
}
