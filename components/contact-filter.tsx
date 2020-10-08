import { RedtailCategory } from "../interfaces/redtail.interface";
import styles from "../styles/ContactFilter.module.scss";

export default function ContactFilter(props) {
  // TODO: Pass in Filter State Obj and update in onChange
  const handleOnChange = (e) => {
    console.log(e.target.value);
    console.log(e.target.checked);
  };

  const onFilterClicked = (e) => {
    // TODO: use button value to get dropdown data value
    // TODO:
    e.preventDefault();
    console.log(e.target.value);
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
              <button
                className={styles.filterItem}
                onClick={onFilterClicked}
                value="category"
              >
                Category
                <img src="/arrow-right.png" className={styles.arrow}></img>
              </button>
              <button
                className={styles.filterItem}
                onClick={onFilterClicked}
                value="status"
              >
                Status
                <img src="/arrow-right.png" className={styles.arrow}></img>
              </button>
              <button
                className={styles.filterItem}
                onClick={onFilterClicked}
                value="source"
              >
                Source
                <img src="/arrow-right.png" className={styles.arrow}></img>
              </button>
              <button
                className={styles.filterItem}
                onClick={onFilterClicked}
                value="servicingAdvisor"
              >
                Servicing Advisor
                <img src="/arrow-right.png" className={styles.arrow}></img>
              </button>
              <button
                className={styles.filterItem}
                onClick={onFilterClicked}
                value="writingAdvisor"
              >
                Writing Advisor
                <img src="/arrow-right.png" className={styles.arrow}></img>
              </button>
            </div>
            <div className={styles.filterItemsColumn}>
              <div className={styles.itemsContainer}>
                {/* TODO:
                 Populate items Container based on what is click
                 Going to need to map through each filter and show depending on what is clicked
                 Keep track of what is clicked with state
                  */}
                {props.dropdownData.categories.map((c: RedtailCategory) => {
                  return (
                    <div
                      className={styles.itemRow}
                      key={`${c.Code}${c.MCCLCode}`}
                    >
                      <input
                        type="checkbox"
                        className={styles.itemCheckbox}
                        value={c.MCCLCode}
                        onChange={handleOnChange}
                      ></input>
                      <div className={styles.item}>{c.Code}</div>
                    </div>
                  );
                })}
              </div>
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
