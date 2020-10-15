import styles from "../../styles/ContactFilter.module.scss";

export const FilterButton = (props) => {
  const selected = props.selectedFilter === props.value;

  return (
    <button
      className={`${styles.filterItem} ${
        selected ? styles.selectedFilter : ""
      } ${props.hasItemsSelected ? styles.hasItems : ""}`}
      onClick={props.onFilterClicked}
      value={props.value}
    >
      {props.label}

      {selected ? (
        <img src="/arrow-right.png" className={styles.arrow}></img>
      ) : null}
    </button>
  );
};
