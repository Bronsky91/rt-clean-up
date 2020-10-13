import { useState } from "react";
import { FilterButton } from "./filter-button";
import { FilterOptions } from "./filter-options";
import styles from "../../styles/ContactFilter.module.scss";

export default function ContactFilter(props) {
  // TODO: Track state of what's checked and unchecked between all the filters
  const initialFilterData = [
    {
      filter: "",
      selectedIds: [],
    },
  ];

  const [selectedFilter, updateSelectedFilter] = useState("categories");

  // TODO: Pass in Filter State Obj and update in onChange
  const handleOnChange = (e) => {
    console.log(e.target.value);
    console.log(e.target.checked);
  };

  const onFilterClicked = (e) => {
    e.preventDefault();
    const filter = e.target.value;
    updateSelectedFilter(filter);
  };

  return (
    <div className={styles.container}>
      <div className={styles.layer}>
        <div className={styles.flexColumnContainer}>
          <div className={styles.flexTopRow}>
            <div className={styles.filterColumn}>
              <div>
                <div className={styles.filterByTitle}>Filter By</div>
                <div className={styles.titleBar}></div>
              </div>
              <FilterButton
                label="Category"
                value="categories"
                selectedFilter={selectedFilter}
                onFilterClicked={onFilterClicked}
              ></FilterButton>

              <FilterButton
                label="Status"
                value="statuses"
                selectedFilter={selectedFilter}
                onFilterClicked={onFilterClicked}
              ></FilterButton>

              <FilterButton
                label="Source"
                value="sources"
                selectedFilter={selectedFilter}
                onFilterClicked={onFilterClicked}
              ></FilterButton>

              <FilterButton
                label="Servicing Advisor"
                value="servicingAdvisors"
                selectedFilter={selectedFilter}
                onFilterClicked={onFilterClicked}
              ></FilterButton>

              <FilterButton
                label="Writing Advisor"
                value="writingAdvisors"
                selectedFilter={selectedFilter}
                onFilterClicked={onFilterClicked}
              ></FilterButton>
            </div>
            <div className={styles.filterItemsColumn}>
              <FilterOptions
                dropdownData={props.dropdownData}
                filter={selectedFilter}
                handleOnChange={handleOnChange}
              ></FilterOptions>
            </div>
          </div>
          <div className={styles.flexButtonRow}>
            <button className={styles.filterButton}>Save</button>
            <button className={styles.filterButton}>Clear All</button>
          </div>
        </div>
      </div>
    </div>
  );
}
