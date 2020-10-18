import { API_URL } from "../constants";
import { useRef, useState } from "react";
import styles from "../styles/ContactListPanel.module.scss";
import ContactFilter from "./filter/contact-filter";
import axios from "axios";
import {
  FilterData,
  RedtailContactListRec,
  RedtailSearchParam,
  ContactListEntry,
} from "../interfaces/redtail-contact-list.interface";

export default function ContactListPanel(props) {
  const pageInput = useRef(null);
  const [pageInputText, setPageInputText] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const contactsPerPage = 50;
  const [isFiltered, setIsFiltered] = useState(false);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [filterPageData, setFilterPageData] = useState({
    currentPage: 1,
    totalPages: 1,
    startIndex: 0,
    endIndex: contactsPerPage - 1,
  });

  const toggleFilterWindow = (e) => {
    e.preventDefault();
    setShowFilters(!showFilters);
  };

  const handlePageInput = (e) => {
    setPageInputText(e.target.value.trim());

    if (e.key === "Enter") {
      const target = e.target;
      const updatedPage: number =
        target.value &&
        !isNaN(target.value) &&
        Number.isInteger(Number(target.value)) &&
        parseInt(target.value) > 0 &&
        parseInt(target.value) <=
          Number(
            isFiltered ? filterPageData.totalPages : props.pageData.totalPages
          )
          ? parseInt(target.value)
          : isFiltered
          ? filterPageData.currentPage
          : props.pageData.currentPage;

      if (
        updatedPage !==
        Number(
          isFiltered ? filterPageData.currentPage : props.pageData.currentPage
        )
      ) {
        changePage(updatedPage);
      } else {
        target.value = isFiltered
          ? filterPageData.currentPage
          : props.pageData.currentPage;
        setPageInputText(
          isFiltered
            ? filterPageData.currentPage.toString()
            : props.pageData.currentPage.toString()
        );
      }
    }
  };

  const handlePagePrev = (e) => {
    e.preventDefault();

    const updatedPage: number = isFiltered
      ? filterPageData.currentPage - 1
      : props.pageData.currentPage - 1;
    if (
      updatedPage > 0 &&
      updatedPage <=
        Number(
          isFiltered ? filterPageData.totalPages : props.pageData.totalPages
        )
    ) {
      changePage(updatedPage);
    }
  };

  const handlePageNext = (e) => {
    e.preventDefault();
    const updatedPage: number = isFiltered
      ? filterPageData.currentPage + 1
      : props.pageData.currentPage + 1;
    if (
      updatedPage > 0 &&
      updatedPage <=
        Number(
          isFiltered ? filterPageData.totalPages : props.pageData.totalPages
        )
    ) {
      changePage(updatedPage);
    }
  };

  const handlePageInputLostFocus = (e) => {
    e.target.value = isFiltered
      ? filterPageData.currentPage
      : props.pageData.currentPage;
    setPageInputText(
      isFiltered
        ? filterPageData.currentPage.toString()
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
        API_URL + "/rt/search-contacts",
        { data: { params: searchParams } },
        { withCredentials: true }
      )
      .then((res) => {
        const list: ContactListEntry[] = res.data;
        //console.log(list);
        console.log(list.length);
        setFilteredContacts(list);
        setFilterPageData({
          currentPage: 1,
          totalPages: Math.ceil(list.length / contactsPerPage),
          startIndex: 0,
          endIndex: contactsPerPage - 1,
        });
        setIsFiltered(true);
        props.setLoadingPage(false);
      });
  };

  const changePage = (updatedPage: number) => {
    props.setLoadingPage(true);

    if (isFiltered) {
      setFilterPageData({
        ...filterPageData,
        currentPage: updatedPage,
        startIndex: contactsPerPage * updatedPage - contactsPerPage,
        endIndex: contactsPerPage * updatedPage - 1,
      });
      props.setLoadingPage(false);
    } else {
      axios
        .get(`${API_URL}/rt/get-contacts?page=${updatedPage}`, {
          withCredentials: true,
        })
        .then((res) => {
          const list: RedtailContactListRec = res.data;
          const contacts = list.contacts;
          const totalCount: number = list.meta.total_records;
          const pageCount: number = list.meta.total_pages;

          props.updatePageData({
            currentPage: updatedPage,
            totalPages: pageCount,
            totalContacts: totalCount,
          });

          const formattedContactList = contacts
            .map((contact) => {
              return {
                id: contact.id,
                lastName: contact.last_name,
              };
            })
            .sort((a, b) => a.id - b.id);

          props.setContactList(formattedContactList);
          pageInput.current.value = updatedPage.toString();
          setPageInputText(updatedPage.toString());
          props.setLoadingPage(false);
        });
    }
  };

  return (
    <div className={styles.contactsPanel}>
      <div className={styles.contactsTopRow}>
        <label className={styles.contactsTitle}>Contacts</label>
        <button className={styles.filterButton} onClick={toggleFilterWindow} />
        {showFilters ? (
          <ContactFilter
            dropdownData={props.dropdownData}
            handleFilter={handleFilter}
          ></ContactFilter>
        ) : null}
      </div>
      <input
        className={styles.contactSearch}
        type="text"
        placeholder="Search Last Name.."
      />
      <select
        className={styles.contactSelect}
        onChange={props.contactSelected}
        name="contact-list"
        size={contactsPerPage}
        value={
          props.selectedContact.id === "" ? undefined : props.selectedContact.id
        }
      >
        {isFiltered
          ? filteredContacts
            ? filteredContacts
                .slice(filterPageData.startIndex, filterPageData.endIndex)
                .map((contact, index) => (
                  <option key={index} value={contact.id}>
                    {contact.id}, {contact.last_name}
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
            isFiltered
              ? filterPageData.currentPage <= 1
              : props.pageData.currentPage <= 1
          }
        >
          &lt;
        </button>
        <span className={styles.pageNumbers}>
          <input
            className={styles.contactPageInput}
            type="text"
            ref={pageInput}
            defaultValue={
              isFiltered
                ? filterPageData.currentPage
                : props.pageData.currentPage
            }
            onKeyDown={handlePageInput}
            onBlur={handlePageInputLostFocus}
            style={{ width: (pageInputText.length + 2).toString() + "rem" }}
          />{" "}
          of{" "}
          {isFiltered
            ? filterPageData.totalPages.toString() + " "
            : props.pageData.totalPages.toString() + " "}
        </span>
        <button
          className={styles.pageButton}
          onClick={handlePageNext}
          disabled={
            isFiltered
              ? filterPageData.currentPage >= filterPageData.totalPages
              : props.pageData.currentPage >= props.pageData.totalPages
          }
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
