import PageLayout from "../layouts/page-layout";
import axios from "axios";
import { useState } from "react";
import { RedtailContact } from "../interfaces/redtail.interface";
import { API_URL } from "../constants";

export default function DataCleanupPage() {
  // TODO: Indicate that the database is being imported and created on the server somehow

  const initialFormData = Object.freeze({
    name: "",
    advisor: "",
    writing: "",
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
          name: contact.last_name,
          writing: contact.first_name,
          advisor: contact.type,
        });
      });
  };

  return (
    <div>
      <button onClick={populateList}>Populate Contact List</button>
      <select onChange={contactSelected} name="contact-list" size={3}>
        {contactList.map((contact, index) => (
          <option key={index}>{contact.id}</option>
        ))}
      </select>
      <label>
        Name:
        <input
          type="text"
          name="name"
          onChange={handleChange}
          value={formData.name}
        />
      </label>
      <label>
        Advisor:
        <input
          type="text"
          name="advisor"
          onChange={handleChange}
          value={formData.advisor}
        />
      </label>
      <label>
        Writing:
        <input
          type="text"
          name="writing"
          onChange={handleChange}
          value={formData.writing}
        />
      </label>
      <input type="submit" value="Update" onClick={handleSubmit} />
    </div>
  );
}

DataCleanupPage.Layout = PageLayout;