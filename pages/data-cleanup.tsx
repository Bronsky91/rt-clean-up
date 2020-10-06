import PageLayout from "../layouts/page-layout";
import styles from "../styles/DataCleanupPage.module.scss";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  RedtailContact,
  RedtailContactMaster,
  RedtailSettingsData,
} from "../interfaces/redtail.interface";
import { API_URL } from "../constants";
import { useRouter } from "next/router";
import Login from "./login";
import { v4 as uuid } from "uuid";

export default function DataCleanupPage(props) {
  const router = useRouter();
  const isAuth = props.isAuth;

  useEffect(() => {
    let mounted = true;
    if (isAuth) {
      // If authenticated, load contact data

      // TODO: Indicate that the database is being imported and created on the server somehow

      axios
        .get(`${API_URL}/rt/get-contacts`, { withCredentials: true })
        .then((res) => {
          if (mounted) {
            const result = res.data;
            const contacts: RedtailContact[] = result.contacts.Detail;
            const totalCount: number = result.contacts.TotalRecords;
            const pageCount: number = Math.ceil(totalCount / 50);

            updatePageData({
              current_page: 1,
              total_pages: pageCount,
            });

            setContactList(
              contacts.map((contact) => {
                return { id: contact.ClientID, lastName: contact.LastName };
              })
            );
          }
        });

      axios
        .get(API_URL + "/rt/dropdowns", { withCredentials: true })
        .then((res) => {
          if (mounted) {
            const dropDownData = res.data;
            updateDropdownData(dropDownData);
          }
        });

      return () => {
        mounted = false;
      };
    } else {
      // If unauthenticated, redirect router to login page
      router.replace(router.pathname, "/login", { shallow: true });
    }
  }, [isAuth]);

  // If unathenticated, load login component
  if (!isAuth) return <Login />;

  const initialPageData = Object.freeze({
    current_page: 1,
    total_pages: 1,
  });

  const initialFormData = Object.freeze({
    key: uuid(),
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
    phone_numbers: [
      { key: uuid(), phone_number: "", type: "", primary: false },
    ],
    email_addresses: [
      { key: uuid(), email_address: "", type: "", primary: false },
    ],
    street_addresses: [
      {
        key: uuid(),
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

  const redtailDropDowns: RedtailSettingsData = {
    statuses: [],
    categories: [],
    sources: [],
    salutations: [],
    servicingAdvisors: [],
    writingAdvisors: [],
  };

  const [formData, updateFormData] = useState(initialFormData);
  const [dropdownData, updateDropdownData] = useState(redtailDropDowns);
  const [contactList, setContactList] = useState([{ id: 0, lastName: "" }]);
  const [pageData, updatePageData] = useState(initialPageData);
  const handleChange = (e) => {
    e.preventDefault();
    const target = e.target;
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

  const contactSelected = (e) => {
    e.preventDefault();
    const id = e.target.value;
    axios
      .post(API_URL + "/rt/get-contact", { id }, { withCredentials: true })
      .then((res) => {
        const data: RedtailContactMaster = res.data;
        updateFormData({
          key: formData.key,
          family_name: data.ContactRecord.Familyname,
          salutation: data.ContactRecord.Salutation
            ? data.ContactRecord.Salutation.toString()
            : "",
          first_name: data.ContactRecord.Firstname,
          middle_name: data.ContactRecord.Middlename,
          last_name: data.ContactRecord.Lastname,
          nickname: data.ContactRecord.Nickname,
          gender: data.ContactRecord.Gender
            ? data.ContactRecord.Gender.toString()
            : "",
          category: data.ContactRecord.CategoryID
            ? data.ContactRecord.CategoryID.toString()
            : "",
          status: data.ContactRecord.StatusID
            ? data.ContactRecord.StatusID.toString()
            : "",
          source: data.ContactRecord.SourceID
            ? data.ContactRecord.SourceID.toString()
            : "",
          referred_by: data.ContactRecord.ReferredBy,
          servicing_advisor: data.ContactRecord.ServicingAdvisorID
            ? data.ContactRecord.ServicingAdvisorID.toString()
            : "",
          writing_advisor: data.ContactRecord.WritingAdvisorID
            ? data.ContactRecord.WritingAdvisorID.toString()
            : "",
          phone_numbers: data.Phone.map((obj, index) => ({
            key: uuid(),
            phone_number: obj.Number,
            type: obj.TypeID,
            primary: obj.Primary,
          })),
          email_addresses: data.Internet.map((obj, index) => ({
            key: uuid(),
            email_address: obj.Address,
            type: obj.Type,
            primary: obj.Primary,
          })),
          street_addresses: data.Address.map((obj, index) => ({
            key: uuid(),
            street_address: obj.Address1,
            secondary_address: obj.Address2,
            city: obj.City,
            state: obj.State,
            zip: obj.Zip,
            type: obj.TypeID,
            primary: obj.Primary,
          })),
        });
      });
  };

  const toggleFilterModal = (e) => {
    e.preventDefault();
    // TODO
  };

  const saveContact = (e) => {
    e.preventDefault();
    // TODO
  };

  const undoContact = (e) => {
    e.preventDefault();
    // TODO
  };

  const changePage = (e) => {
    e.preventDefault();
    const target = e.target;
    updatePageData({
      current_page:
        Number.isInteger(target.value) &&
        target.value > 0 &&
        target.value <= pageData.total_pages
          ? target.value
          : pageData.current_page,
      total_pages: pageData.total_pages,
    });
    // TODO: API call for new page's data
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
          placeholder="Search Last Name.."
        />
        <select
          className={styles.contactSelect}
          onChange={contactSelected}
          name="contact-list"
          size={50}
        >
          {contactList.map((contact, index) => (
            <option key={index} value={contact.id || ""}>
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
      <form className={styles.editPanel} autoComplete="off">
        <div className={styles.formRow}>
          <div className={styles.formColumn}>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Family Name</label>
              <input
                className={styles.formLabelledInput}
                type="text"
                name="family_name"
                onChange={handleChange}
                value={formData.family_name}
              />
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Salutation</label>
              <input
                className={styles.formLabelledInput}
                type="text"
                name="salutation"
                onChange={handleChange}
                value={formData.salutation}
              />
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>First Name</label>
              <input
                className={styles.formLabelledInput}
                type="text"
                name="first_name"
                onChange={handleChange}
                value={formData.first_name}
              />
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Middle Name</label>
              <input
                className={styles.formLabelledInput}
                type="text"
                name="middle_name"
                onChange={handleChange}
                value={formData.middle_name}
              />
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Last Name</label>
              <input
                className={styles.formLabelledInput}
                type="text"
                name="last_name"
                onChange={handleChange}
                value={formData.last_name}
              />
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Nickname</label>
              <input
                className={styles.formLabelledInput}
                type="text"
                name="nickname"
                onChange={handleChange}
                value={formData.nickname}
              />
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Gender</label>
              <input
                className={styles.formLabelledInput}
                type="text"
                name="gender"
                onChange={handleChange}
                value={formData.gender}
              />
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Category</label>
              <input
                className={styles.formLabelledInput}
                type="text"
                name="category"
                onChange={handleChange}
                value={formData.category}
              />
            </div>
            <div className={styles.formField}>
              <label className={styles.formLabel}>Status</label>
              <input
                className={styles.formLabelledInput}
                type="text"
                name="status"
                onChange={handleChange}
                value={formData.status}
              />
            </div>
          </div>

          <div className={styles.formColumn}>
            <div className={styles.formRow}>
              <div className={styles.formColumn}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Source</label>
                  <input
                    className={styles.formLabelledInput}
                    type="text"
                    name="source"
                    onChange={handleChange}
                    value={formData.source}
                  />
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Referred By</label>
                  <input
                    className={styles.formLabelledInput}
                    type="text"
                    name="referred_by"
                    onChange={handleChange}
                    value={formData.referred_by}
                  />
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Servicing Advisor</label>
                  <input
                    className={styles.formLabelledInput}
                    type="text"
                    name="servicing_advisor"
                    onChange={handleChange}
                    value={formData.servicing_advisor}
                  />
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Writing Advisor</label>
                  <input
                    className={styles.formLabelledInput}
                    type="text"
                    name="writing_advisor"
                    onChange={handleChange}
                    value={formData.writing_advisor}
                  />
                </div>
              </div>
              <div className={styles.formColumn}>
                <div className={styles.formRow}>
                  <div className={styles.formHeader}>
                    <label className={styles.formLabel}>Phone Number</label>
                  </div>
                  <div className={styles.formHeader}>
                    <label className={styles.formLabel}>Type</label>
                  </div>
                  <div className={styles.formHeader}>
                    <label className={styles.formLabel}>Primary?</label>
                  </div>
                </div>
                <div className={styles.formColumnScroll}>
                  {formData.phone_numbers.map((obj, index) => (
                    <div className={styles.formRow} key={obj.key}>
                      <input
                        className={styles.formSoloInput}
                        type="text"
                        value={obj.phone_number || ""}
                        onChange={handleChange}
                      />
                      <input
                        className={styles.formSoloInput}
                        type="text"
                        value={obj.type || ""}
                        onChange={handleChange}
                      />
                      <input
                        type="radio"
                        name="phone_number"
                        value=""
                        defaultChecked={obj.primary || false}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formColumn}>
                <div className={styles.formRow}>
                  <div className={styles.formHeader}>
                    <label className={styles.formLabel}>Email Address</label>
                  </div>
                  <div className={styles.formHeader}>
                    <label className={styles.formLabel}>Type</label>
                  </div>
                  <div className={styles.formHeader}>
                    <label className={styles.formLabel}>Primary?</label>
                  </div>
                </div>
                <div className={styles.formColumnScroll}>
                  {formData.email_addresses.map((obj, index) => (
                    <div className={styles.formRow} key={obj.key}>
                      <input
                        className={styles.formSoloInput}
                        type="text"
                        value={obj.email_address || ""}
                        onChange={handleChange}
                      />
                      <input
                        className={styles.formSoloInput}
                        type="text"
                        value={obj.type || ""}
                        onChange={handleChange}
                      />
                      <input
                        type="radio"
                        name="email_address"
                        value=""
                        defaultChecked={obj.primary || false}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.formColumn}>
                <button className={styles.saveButton} onClick={saveContact}>
                  SAVE
                </button>
                <button className={styles.undoButton} onClick={undoContact}>
                  UNDO
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formColumn}>
            <div className={styles.formRow}>
              <div className={styles.formHeader}>
                <label className={styles.formLabel}>Street Address</label>
              </div>
              <div className={styles.formHeader}>
                <label className={styles.formLabel}>Secondary Address</label>
              </div>
              <div className={styles.formHeader}>
                <label className={styles.formLabel}>City</label>
              </div>
              <div className={styles.formHeader}>
                <label className={styles.formLabel}>State</label>
              </div>
              <div className={styles.formHeader}>
                <label className={styles.formLabel}>Zip</label>
              </div>
              <div className={styles.formHeader}>
                <label className={styles.formLabel}>Type</label>
              </div>
              <div className={styles.formHeader}>
                <label className={styles.formLabel}>Primary?</label>
              </div>
            </div>
            <div className={styles.formColumnScroll}>
            {formData.street_addresses.map((obj, index) => (
              <div className={styles.formRow} key={obj.key}>
                <input
                  className={styles.formSoloInput}
                  type="text"
                  value={obj.street_address || ""}
                  onChange={handleChange}
                />
                <input
                  className={styles.formSoloInput}
                  type="text"
                  value={obj.secondary_address || ""}
                  onChange={handleChange}
                />
                <input
                  className={styles.formSoloInput}
                  type="text"
                  value={obj.city || ""}
                  onChange={handleChange}
                />
                <input
                  className={styles.formSoloInput}
                  type="text"
                  value={obj.state || ""}
                  onChange={handleChange}
                />
                <input
                  className={styles.formSoloInput}
                  type="text"
                  value={obj.zip || ""}
                  onChange={handleChange}
                />
                <input
                  className={styles.formSoloInput}
                  type="text"
                  value={obj.type || ""}
                  onChange={handleChange}
                />
                <input
                  type="radio"
                  name="street_address"
                  value=""
                  defaultChecked={obj.primary || false}
                />
              </div>
            ))}
          </div>
          </div>
        </div>
      </form>
    </div>
  );
}

DataCleanupPage.Layout = PageLayout;
