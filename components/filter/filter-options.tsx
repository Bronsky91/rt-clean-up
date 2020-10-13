import styles from "../../styles/ContactFilter.module.scss";

export const FilterOptions = (props) => {
  const filterValue = {
    categories: "MCCLCode",
    statuses: "CSLCode",
    sources: "MCSLCode",
    servicingAdvisors: "SALCode",
    writingAdvisors: "WALCode",
  };

  return (
    <div className={styles.itemsContainer}>
      {props.dropdownData[props.filter].map((c) => {
        return (
          <div
            className={styles.itemRow}
            key={`${c.Code}${c[filterValue[props.filter]]}`}
          >
            <input
              type="checkbox"
              className={styles.itemCheckbox}
              value={c[filterValue[props.filter]]}
              onChange={props.handleOnChange}
            ></input>
            <div className={styles.item}>{c.Code}</div>
          </div>
        );
      })}
    </div>
  );
};
