import styles from "../styles/ContactListPanel.module.scss";

export default function ConstListPanel(props) {
  const toggleFilterModal = (e) => {
    e.preventDefault();
    // TODO
  };

  const changePage = (e) => {
    e.preventDefault();
    const target = e.target;
    props.updatePageData({
      current_page:
        Number.isInteger(target.value) &&
        target.value > 0 &&
        target.value <= props.pageData.total_pages
          ? target.value
          : props.pageData.current_page,
      total_pages: props.pageData.total_pages,
    });
    // TODO: API call for new page's data
  };

  return (
    <div className={styles.contactsPanel}>
      <div className={styles.contactsTopRow}>
        <label className={styles.contactsTitle}>Contacts</label>
        <button className={styles.filterButton} onClick={toggleFilterModal} />
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
        {props.contactList.map((contact, index) => (
          <option key={index} value={contact.id}>
            {contact.id}, {contact.lastName}
          </option>
        ))}
      </select>
      <div className={styles.contactPageRow}>
        <button>&lt;</button>
        <input
          className={styles.contactPageInput}
          type="text"
          defaultValue={props.pageData.current_page}
          onChange={changePage}
        />{" "}
        of {props.pageData.total_pages.toString() + " "}
        <button>&gt;</button>
      </div>
    </div>
  );
}
