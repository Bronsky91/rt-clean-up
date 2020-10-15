import { useState } from "react";
import { FilterButton } from "./filter-button";
import { FilterOptions } from "./filter-options";
import styles from "../../styles/ContactFilter.module.scss";

export default function ContactFilter(props) {
  const initialFilterData: FilterData[] = [
    {
      filter: "categories",
      selectedIds: [],
    },
    {
      filter: "statuses",
      selectedIds: [],
    },
    {
      filter: "sources",
      selectedIds: [],
    },
    {
      filter: "servicingAdvisors",
      selectedIds: [],
    },
    {
      filter: "writingAdvisors",
      selectedIds: [],
    },
  ];

  const [selectedFilter, updateSelectedFilter] = useState("categories");
  const [filterData, updateFilterData] = useState(initialFilterData);

  const handleApply = (e) => {
    // TODO: Pass in FilterData Obj on apply up to props ?
  };

  const handleClear = (e) => {
    updateFilterData(filterData.map((f) => ({ ...f, selectedIds: [] })));
  };

  const handleOnChange = (e) => {
    const selectedFilterIndex = filterData.findIndex(
      (f) => f.filter === selectedFilter
    );
    const newSelectedId: number = e.target.value;
    const idSelected: boolean = e.target.checked;

    updateFilterData(
      filterData.map((f, index) => {
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
                hasItemsSelected={filterHasItemsSelected(
                  filterData,
                  "categories"
                )}
              ></FilterButton>

              <FilterButton
                label="Status"
                value="statuses"
                selectedFilter={selectedFilter}
                onFilterClicked={onFilterClicked}
                hasItemsSelected={filterHasItemsSelected(
                  filterData,
                  "statuses"
                )}
              ></FilterButton>

              <FilterButton
                label="Source"
                value="sources"
                selectedFilter={selectedFilter}
                onFilterClicked={onFilterClicked}
                hasItemsSelected={filterHasItemsSelected(filterData, "sources")}
              ></FilterButton>

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
              ></FilterButton>
            </div>
            <div className={styles.filterItemsColumn}>
              <FilterOptions
                dropdownData={props.dropdownData}
                filter={selectedFilter}
                handleOnChange={handleOnChange}
                filterData={filterData}
              ></FilterOptions>
            </div>
          </div>
          <div className={styles.flexButtonRow}>
            <button className={styles.filterButton} onClick={handleApply}>
              Apply
            </button>
            <button className={styles.filterButton} onClick={handleClear}>
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

export interface FilterData {
  filter: string;
  selectedIds: number[];
}
