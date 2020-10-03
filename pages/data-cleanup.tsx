import PageLayout from "../layouts/page-layout";
import styles from "../styles/DataCleanupPage.module.scss";
import axios from "axios";
import { useEffect, useState } from "react";
import { RedtailContact } from "../interfaces/redtail.interface";
import { API_URL } from "../constants";
import { useRouter } from "next/router";
import Home from ".";

export default function DataCleanupPage(props) {
  // TODO: Indicate that the database is being imported and created on the server somehow

  const initialFormData = Object.freeze({
    family_name: "",
    salutation: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    nickname: "",
    gender: "",
    category: "",
    status: "",
    source: "",
    referred_by: "",
    servicing_advisor: "",
    writing_advisor: "",
    phone_numbers: [{ phone_number: "", type: "", primary: false }],
    email_addresses: [{ email_address: "", type: "", primary: false }],
    street_addresses: [
      {
        street_address: "",
        secondary_address: "",
        city: "",
        state: "",
        zip: "",
        type: "",
        primary: false,
      },
    ],
  });

  const [formData, updateFormData] = useState(initialFormData);
  const [contactList, setContactList] = useState([{ id: 0 }]);

  const handleChange = (event) => {
    const target = event.target;
    updateFormData({
      ...formData,
      // Trimming any whitespace
      [target.name]: target.value.trim(),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        API_URL + "/rt/contact-submit",
        { data: formData },
        { withCredentials: true }
      )
      .then((res) => {
        console.log("Submitted Contact!");
      });
  };

  const populateList = (): void => {
    //! Temp solution
    axios
      .get(API_URL + "/rt/get-contacts", { withCredentials: true })
      .then((res) => {
        const contacts: RedtailContact[] = res.data.contacts;
        console.log(res.data);
        setContactList(
          contacts.map((contact) => {
            return { id: contact.id };
          })
        );
      });
  };

  const contactSelected = (e) => {
    const id = e.target.value;
    axios
      .post(API_URL + "/rt/get-contact", { id }, { withCredentials: true })
      .then((res) => {
        const contact: RedtailContact = res.data[0];
        updateFormData({
          family_name: "",
          salutation: contact.salutation_id
            ? contact.salutation_id.toString()
            : "",
          first_name: contact.first_name,
          middle_name: contact.middle_name,
          last_name: contact.last_name,
          nickname: contact.nickname,
          gender: contact.gender ? contact.gender.toString() : "",
          category: contact.category_id ? contact.category_id.toString() : "",
          status: contact.status_id ? contact.status_id.toString() : "",
          source: contact.source_id ? contact.source_id.toString() : "",
          referred_by: contact.referred_by,
          servicing_advisor: contact.servicing_advisor_id
            ? contact.servicing_advisor_id.toString()
            : "",
          writing_advisor: contact.writing_advisor_id
            ? contact.writing_advisor_id.toString()
            : "",
          phone_numbers: [{ phone_number: "", type: "", primary: false }],
          email_addresses: [{ email_address: "", type: "", primary: false }],
          street_addresses: [
            {
              street_address: "",
              secondary_address: "",
              city: "",
              state: "",
              zip: "",
              type: "",
              primary: false,
            },
          ],
        });
      });
  };

  const toggleFilterModal = (event) => {
    // TODO
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageTitle}>Data Cleanup</div>
      <div className={styles.contactsPanel}>
        <div className={styles.contactsTopRow}>
          <label className={styles.contactsTitle}>Contacts</label>
          <button className={styles.filterButton} onClick={toggleFilterModal} />
        </div>
        <input
          className={styles.contactSearch}
          type="text"
          placeholder="Search.."
        />
        <select
          className={styles.contactSelect}
          onChange={contactSelected}
          name="contact-list"
          size={100}
        >
          {contactList.map((contact, index) => (
            <option key={index}>{contact.id}</option>
          ))}
        </select>
      </div>
      <div className={styles.contactForm}>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Family Name</label>
          <input
            className={styles.formInput}
            type="text"
            name="family_name"
            onChange={handleChange}
            value={formData.family_name}
          />
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Salutation</label>
          <input
            className={styles.formInput}
            type="text"
            name="salutation"
            onChange={handleChange}
            value={formData.salutation}
          />
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>First Name</label>
          <input
            className={styles.formInput}
            type="text"
            name="first_name"
            onChange={handleChange}
            value={formData.first_name}
          />
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Middle Name</label>
          <input
            className={styles.formInput}
            type="text"
            name="middle_name"
            onChange={handleChange}
            value={formData.middle_name}
          />
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Last Name</label>
          <input
            className={styles.formInput}
            type="text"
            name="last_name"
            onChange={handleChange}
            value={formData.last_name}
          />
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Nickname</label>
          <input
            className={styles.formInput}
            type="text"
            name="nickname"
            onChange={handleChange}
            value={formData.nickname}
          />
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Gender</label>
          <input
            className={styles.formInput}
            type="text"
            name="gender"
            onChange={handleChange}
            value={formData.gender}
          />
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Category</label>
          <input
            className={styles.formInput}
            type="text"
            name="category"
            onChange={handleChange}
            value={formData.category}
          />
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Status</label>
          <input
            className={styles.formInput}
            type="text"
            name="status"
            onChange={handleChange}
            value={formData.status}
          />
        </div>

        <button onClick={populateList}>Populate Contact List</button>
        <input type="submit" value="Update" onClick={handleSubmit} />
      </div>
    </div>
  );
}

DataCleanupPage.Layout = PageLayout;
