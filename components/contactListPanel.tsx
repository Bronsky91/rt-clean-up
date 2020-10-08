export default function constListPanel() {
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
        onChange={contactSelected}
        name="contact-list"
        size={50}
        value={selectedContact.id === "" ? undefined : selectedContact.id}
      >
        {contactList.map((contact, index) => (
          <option key={index} value={contact.id}>
            {contact.id}, {contact.lastName}
          </option>
        ))}
      </select>
      <div className={styles.contactPageRow}>
        <button onClick={saveContact}>&lt;</button>
        <input
          className={styles.contactPageInput}
          type="text"
          defaultValue={pageData.current_page}
          onChange={changePage}
        />{" "}
        of {pageData.total_pages.toString() + " "}
        <button onClick={saveContact}>&gt;</button>
      </div>
    </div>
  );
}
