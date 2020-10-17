import { API_URL } from "../constants";
import { useRef, useState } from "react";
import styles from "../styles/ContactListPanel.module.scss";
import ContactFilter from "./filter/contact-filter";
import axios from "axios";
import { RedtailContactListRec } from "../interfaces/redtail-contact-list.interface";

export default function ContactListPanel(props) {
  const [pageInputText, setPageInputText] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const pageInput = useRef(null);

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
        parseInt(target.value) <= props.pageData.totalPages
          ? parseInt(target.value)
          : props.pageData.currentPage;

      if (updatedPage !== props.pageData.currentPage) {
        changePage(updatedPage);
      } else {
        target.value = props.pageData.currentPage;
        setPageInputText(props.pageData.currentPage.toString());
      }
    }
  };

  const handlePagePrev = (e) => {
    e.preventDefault();
    const updatedPage: number = props.pageData.currentPage - 1;
    if (updatedPage > 0 && updatedPage <= props.pageData.totalPages) {
      changePage(updatedPage);
    }
  };

  const handlePageNext = (e) => {
    e.preventDefault();
    const updatedPage: number = props.pageData.currentPage + 1;
    if (updatedPage > 0 && updatedPage <= props.pageData.totalPages) {
      changePage(updatedPage);
    }
  };

  const handlePageInputLostFocus = (e) => {
    e.target.value = props.pageData.currentPage;
    setPageInputText(props.pageData.currentPage.toString());
  };

  const handleFilter = (filterData) => {
    console.log(filterData);
    // TODO: Make API call and do similar logic as page
    // axios.post()
    // TODO: post body params need to be EX: {category_id: [2,3], source_id: [4]}
  };

  const changePage = (updatedPage: number) => {
    props.setLoadingPage(true);

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
        size={50}
        value={
          props.selectedContact.id === "" ? undefined : props.selectedContact.id
        }
      >
        {props.contactList
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
          disabled={props.pageData.currentPage <= 1}
        >
          &lt;
        </button>
        <span className={styles.pageNumbers}>
          <input
            className={styles.contactPageInput}
            type="text"
            ref={pageInput}
            defaultValue={props.pageData.currentPage}
            onKeyDown={handlePageInput}
            onBlur={handlePageInputLostFocus}
            style={{ width: (pageInputText.length + 2).toString() + "rem" }}
          />{" "}
          of {props.pageData.totalPages.toString() + " "}
        </span>
        <button
          className={styles.pageButton}
          onClick={handlePageNext}
          disabled={props.pageData.currentPage >= props.pageData.totalPages}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
