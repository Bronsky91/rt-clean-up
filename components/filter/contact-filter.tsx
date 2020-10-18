import { useState } from "react";
import { FilterButton } from "./filter-button";
import { FilterOptions } from "./filter-options";
import styles from "../../styles/ContactFilter.module.scss";
import { FilterData } from "../../interfaces/redtail-contact-list.interface";

export default function ContactFilter(props) {
  const handleApply = (e) => {
    props.handleFilter(props.filterData);
  };

  const handleClear = (e) => {
    props.updateFilterData(
      props.filterData.map((f) => ({ ...f, selectedIds: [] }))
    );
    props.handleClear();
  };

  const handleOnChange = (e) => {
    const selectedFilterIndex = props.filterData.findIndex(
      (f) => f.filter === props.selectedFilter
    );
    const newSelectedId: number = e.target.value;
    const idSelected: boolean = e.target.checked;

    props.updateFilterData(
      props.filterData.map((f, index) => {
        if (index === selectedFilterIndex) {
          const newSelectedIds = idSelected
            ? [...f.selectedIds, newSelectedId]
            : f.selectedIds.filter((id) => id !== newSelectedId);

          return { ...f, selectedIds: [...newSelectedIds] };
        }
        return f;
      })
    );
  };

  const onFilterClicked = (e) => {
    e.preventDefault();
    const filter = e.target.value;
    props.updateSelectedFilter(filter);
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
                label="Status"
                value="status_id"
                selectedFilter={props.selectedFilter}
                onFilterClicked={onFilterClicked}
                hasItemsSelected={filterHasItemsSelected(
                  props.filterData,
                  "status_id"
                )}
              ></FilterButton>

              <FilterButton
                label="Source"
                value="source_id"
                selectedFilter={props.selectedFilter}
                onFilterClicked={onFilterClicked}
                hasItemsSelected={filterHasItemsSelected(
                  props.filterData,
                  "source_id"
                )}
              ></FilterButton>

              <FilterButton
                label="Category"
                value="category_id"
                selectedFilter={props.selectedFilter}
                onFilterClicked={onFilterClicked}
                hasItemsSelected={filterHasItemsSelected(
                  props.filterData,
                  "category_id"
                )}
              ></FilterButton>
              {/*
              <FilterButton
                label="Servicing Advisor"
                value="servicingAdvisors"
                selectedFilter={selectedFilter}
                onFilterClicked={onFilterClicked}
                hasItemsSelected={filterHasItemsSelected(
                  filterData,
                  "servicingAdvisors"
                )}
              ></FilterButton>

              <FilterButton
                label="Writing Advisor"
                value="writingAdvisors"
                selectedFilter={selectedFilter}
                onFilterClicked={onFilterClicked}
                hasItemsSelected={filterHasItemsSelected(
                  filterData,
                  "writingAdvisors"
                )}
              ></FilterButton> */}
            </div>
            <div className={styles.filterItemsColumn}>
              <FilterOptions
                dropdownData={props.dropdownData}
                filter={props.selectedFilter}
                handleOnChange={handleOnChange}
                filterData={props.filterData}
              ></FilterOptions>
            </div>
          </div>
          <div className={styles.flexButtonRow}>
            <button className={styles.filterButton} onClick={handleApply}>
              Apply
            </button>
            <button
              className={styles.filterButton}
              onClick={handleClear}
              disabled={!props.isFiltered}
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const filterHasItemsSelected = (filterData: FilterData[], filterName) =>
  filterData.find((f) => f.filter === filterName && f.selectedIds.length > 0);
