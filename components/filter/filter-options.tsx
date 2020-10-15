import styles from "../../styles/ContactFilter.module.scss";
import { FilterData } from "./contact-filter";

export const FilterOptions = (props) => {
  const codes = {
    categories: "MCCLCode",
    statuses: "CSLCode",
    sources: "MCSLCode",
    servicingAdvisors: "SALCode",
    writingAdvisors: "WALCode",
  };

  const filterData: FilterData = props.filterData.find(
    (data) => data.filter === props.filter
  );

  return (
    <div className={styles.itemsContainer}>
      {props.dropdownData[props.filter].map((c) => {
        const filterValue = c[codes[props.filter]];
        const checked: boolean = !!filterData.selectedIds.find(
          (id) => Number(id) === filterValue
        );

        return (
          <div
            className={styles.itemRow}
            key={`${c.Code}${c[codes[props.filter]]}`}
          >
            <input
              type="checkbox"
              className={styles.itemCheckbox}
              value={c[codes[props.filter]]}
              onChange={props.handleOnChange}
              checked={checked}
            ></input>
            <div className={styles.item}>{c.Code}</div>
          </div>
        );
      })}
    </div>
  );
};
