import styles from "../../styles/ContactFilter.module.scss";
import { FilterData } from "./contact-filter";

export const FilterOptions = (props) => {
  console.log(props.filter);
  const filterData: FilterData = props.filterData.find(
    (data) => data.filter === props.filter
  );

  return (
    <div className={styles.itemsContainer}>
      {props.dropdownData[props.filter].map((c) => {
        const filterValue: number = c.id;
        const checked: boolean = !!filterData.selectedIds.find(
          (id) => Number(id) === filterValue
        );

        return (
          <div className={styles.itemRow} key={`${c.id}${props.filter}`}>
            <input
              type="checkbox"
              className={styles.itemCheckbox}
              value={c.id}
              onChange={props.handleOnChange}
              checked={checked}
            ></input>
            <div className={styles.item}>{c.name}</div>
          </div>
        );
      })}
    </div>
  );
};
