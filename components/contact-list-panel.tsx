import { useEffect, useState } from "react";
import styles from "../styles/ContactListPanel.module.scss";
import ContactFilter from "./filter/contact-filter";
import axios from "axios";
import {
  ContactListEntry,
  FilterData,
  RedtailSearchParam,
} from "../interfaces/redtail-contact-list.interface";
import { createEmptyFilterData } from "../utils/create-empty-form-data";

export default function ContactListPanel(props) {
  const emptyFilterData: Readonly<FilterData[]> = createEmptyFilterData();
  const [selectedFilter, updateSelectedFilter] = useState("status_id");
  const [filterData, updateFilterData] = useState(emptyFilterData);
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilterWindow = (e) => {
    e.preventDefault();
    setShowFilters(!showFilters);
  };

  const handlePageInput = (e) => {
    props.setPageInputText(e.target.value.trim());

    if (e.key === "Enter") {
      const target = e.target;
      const updatedPage: number =
        target.value &&
        !isNaN(target.value) &&
        Number.isInteger(Number(target.value)) &&
        parseInt(target.value) > 0 &&
        parseInt(target.value) <=
          Number(
            props.isFiltered
              ? props.filterPageData.totalPages
              : props.pageData.totalPages
          )
          ? parseInt(target.value)
          : props.isFiltered
          ? props.filterPageData.currentPage
          : props.pageData.currentPage;

      if (
        updatedPage !==
        Number(
          props.isFiltered
            ? props.filterPageData.currentPage
            : props.pageData.currentPage
        )
      ) {
        props.changePage(updatedPage);
      } else {
        target.value = props.isFiltered
          ? props.filterPageData.currentPage
          : props.pageData.currentPage;
        props.setPageInputText(
          props.isFiltered
            ? props.filterPageData.currentPage.toString()
            : props.pageData.currentPage.toString()
        );
      }
    }
  };

  const handlePagePrev = (e) => {
    e.preventDefault();

    const updatedPage: number = props.isFiltered
      ? props.filterPageData.currentPage - 1
      : props.pageData.currentPage - 1;
    if (
      updatedPage > 0 &&
      updatedPage <=
        Number(
          props.isFiltered
            ? props.filterPageData.totalPages
            : props.pageData.totalPages
        )
    ) {
      props.changePage(updatedPage);
    }
  };

  const handlePageNext = (e) => {
    e.preventDefault();
    const updatedPage: number = props.isFiltered
      ? props.filterPageData.currentPage + 1
      : props.pageData.currentPage + 1;
    if (
      updatedPage > 0 &&
      updatedPage <=
        Number(
          props.isFiltered
            ? props.filterPageData.totalPages
            : props.pageData.totalPages
        )
    ) {
      props.changePage(updatedPage);
    }
  };

  const handlePageInputLostFocus = (e) => {
    e.target.value = props.isFiltered
      ? props.filterPageData.currentPage
      : props.pageData.currentPage;
    props.setPageInputText(
      props.isFiltered
        ? props.filterPageData.currentPage.toString()
        : props.pageData.currentPage.toString()
    );
  };

  const handleFilter = (filterData: FilterData[]) => {
    props.setLoadingPage(true);

    const mappedParams = filterData.map((f) => {
      if (f.selectedIds.length > 0)
        return { [f.filter]: f.selectedIds.map(Number) };
    });
    const searchParams: RedtailSearchParam = Object.assign({}, ...mappedParams);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/rt/search-contacts`,
        { data: { params: searchParams } },
        { withCredentials: true }
      )
      .then((res) => {
        const list: ContactListEntry[] = res.data;
        props.setFilteredContactList(list);
        props.setFilterPageData({
          ...props.filterPageData,
          currentPage: 1,
          totalPages:
            Math.ceil(list.length / props.contactsPerPage) < 1
              ? 1
              : Math.ceil(list.length / props.contactsPerPage),
          startIndex: 0,
          endIndex: props.contactsPerPage,
        });
        props.setIsFiltered(true);
        setShowFilters(false);
        props.pageInput.current.value = "1";
        props.setPageInputText("1");

        // After loading filtered page, select first contact
        if (list && list[0]) {
          props.selectContact(list[0].id.toString());
        }
        props.setLoadingPage(false);
      });
  };

  const handleClear = () => {
    props.setFilterPageData({
      currentPage: 1,
      totalPages: 1,
      startIndex: 0,
      endIndex: props.contactsPerPage,
    });
    props.setFilteredContactList([]);
    props.setIsFiltered(false);
    setShowFilters(false);
  };

  // Change page back to 1 after isFilter is set to false
  useEffect(() => {
    if (!props.isFiltered) {
      props.changePage(1);
    }
  }, [props.isFiltered]);

  return (
    <div className={styles.contactsPanel}>
      <div className={styles.contactsTopRow}>
        <label className={styles.contactsTitle}>Contacts</label>
        <button className={styles.filterButton} onClick={toggleFilterWindow} />
        {showFilters ? (
          <ContactFilter
            dropdownData={props.dropdownData}
            handleFilter={handleFilter}
            handleClear={handleClear}
            isFiltered={props.isFiltered}
            updateSelectedFilter={updateSelectedFilter}
            selectedFilter={selectedFilter}
            updateFilterData={updateFilterData}
            filterData={filterData}
            setShowFilters={setShowFilters}
          ></ContactFilter>
        ) : null}
      </div>
      {/* <input
        className={styles.contactSearch}
        type="text"
        placeholder="Search Last Name.."
      /> */}
      <select
        className={styles.contactSelect}
        onChange={props.contactSelected}
        name="contact-list"
        size={props.contactsPerPage}
        value={
          props.selectedContact.id === "" ? undefined : props.selectedContact.id
        }
      >
        {props.isFiltered
          ? props.filteredContactList
            ? props.filteredContactList
                .slice(
                  props.filterPageData.startIndex,
                  props.filterPageData.endIndex
                )
                .map((contact, index) => (
                  <option key={index} value={contact.id}>
                    {contact.id}, {contact.lastName}
                  </option>
                ))
            : ""
          : props.contactList
          ? props.contactList.map((contact, index) => (
              <option key={index} value={contact.id}>
                {contact.id}, {contact.lastName}
              </option>
            ))
          : ""}
      </select>
      <div className={styles.contactPageRow}>
        <button
          className={styles.pageButton}
          onClick={handlePagePrev}
          disabled={
            props.isFiltered
              ? props.filterPageData.currentPage <= 1
              : props.pageData.currentPage <= 1
          }
        >
          &lt;
        </button>
        <span className={styles.pageNumbers}>
          <input
            className={styles.contactPageInput}
            type="text"
            ref={props.pageInput}
            defaultValue={
              props.isFiltered
                ? props.filterPageData.currentPage
                : props.pageData.currentPage
            }
            onKeyDown={handlePageInput}
            onBlur={handlePageInputLostFocus}
            style={{
              width: (props.pageInputText.length + 2).toString() + "rem",
            }}
          />{" "}
          of{" "}
          {props.isFiltered
            ? props.filterPageData.totalPages.toString() + " "
            : props.pageData.totalPages.toString() + " "}
        </span>
        <button
          className={styles.pageButton}
          onClick={handlePageNext}
          disabled={
            props.isFiltered
              ? props.filterPageData.currentPage >=
                props.filterPageData.totalPages
              : props.pageData.currentPage >= props.pageData.totalPages
          }
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
