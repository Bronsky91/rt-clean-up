import PageLayout from "../layouts/page-layout";
import styles from "../styles/DataCleanupPage.module.scss";
import axios from "axios";
import { v4 as uuid } from "uuid";
import LoadingOverlay from "react-loading-overlay";
import { useEffect, useState } from "react";
import {
  RedtailContact,
  RedtailContactMaster,
  RedtailSettingsData,
} from "../interfaces/redtail.interface";
import { API_URL } from "../constants";
import { useRouter } from "next/router";
import Login from "./login";
export default function DataCleanupPage(props) {
  const router = useRouter();
  const isAuth = props.isAuth;

  useEffect(() => {
    // mounted used to avoid issue outlined here: https://www.debuggr.io/react-update-unmounted-component/
    let mounted = true;

    if (isAuth) {
      // If authenticated, load contact data
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
              contacts
                .map((contact) => {
                  return { id: contact.ClientID, lastName: contact.LastName };
                })
                .sort((a, b) => a.id - b.id)
            );
          }
        });

      axios
        .get(API_URL + "/rt/dropdowns", { withCredentials: true })
        .then((res) => {
          if (mounted) {
            const dropdownData: RedtailSettingsData = res.data;
            updateDropdownData(dropdownData);
          }
        });

      // Get LocalStorage when on client side
      const localStorageFormData = JSON.parse(
        localStorage.getItem("dataCleanUpFormData")
      );
      const localStorageSelectedContactData = JSON.parse(
        localStorage.getItem("dataCleanUpSelectedContactData")
      );

      if (localStorageSelectedContactData)
        updateSelectedContact(localStorageSelectedContactData);

      if (localStorageFormData) updateFormData(localStorageFormData);

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
  const initialContactListData = [];

  let initialFormData = Object.freeze({
    key: uuid(),
    familyName: "",
    salutation: "",
    firstName: "",
    middleName: "",
    lastName: "",
    nickname: "",
    gender: "",
    category: "",
    status: "",
    source: "",
    referredBy: "",
    servicingAdvisor: "",
    writingAdvisor: "",
    phoneNumbers: [{ key: uuid(), phoneNumber: "", type: "", primary: false }],
    emailAddresses: [
      { key: uuid(), emailAddress: "", type: "", primary: false },
    ],
    streetAddresses: [
      {
        key: uuid(),
        streetAddress: "",
        secondaryAddress: "",
        city: "",
        state: "",
        zip: "",
        type: "",
        primary: false,
      },
    ],
  });

  let initialSelectedContact = { id: "", page: 1 };

  const redtailDropDowns: RedtailSettingsData = {
    statuses: [],
    categories: [],
    sources: [],
    salutations: [],
    servicingAdvisors: [],
    writingAdvisors: [],
  };

  const [formData, updateFormData] = useState(initialFormData);
  const [selectedContact, updateSelectedContact] = useState(
    initialSelectedContact
  );
  const [contactList, setContactList] = useState(initialContactListData);
  const [dropdownData, updateDropdownData] = useState(redtailDropDowns);
  const [pageData, updatePageData] = useState(initialPageData);
  const [loadingContact, setLoadingState] = useState(false);

  // Saves Form State to Local Storage after each change
  useEffect(() => {
    localStorage.setItem("dataCleanUpFormData", JSON.stringify(formData));
    localStorage.setItem(
      "dataCleanUpSelectedContactData",
      JSON.stringify(selectedContact)
    );
  }, [formData, selectedContact]);

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
    setLoadingState(true);

    const id = e.target.value;
    updateSelectedContact({ id, page: 1 });

    axios
      .post(API_URL + "/rt/get-contact", { id }, { withCredentials: true })
      .then((res) => {
        const data: RedtailContactMaster = res.data;
        updateFormData({
          key: formData.key,
          familyName: data.ContactRecord.Familyname,
          salutation: data.ContactRecord.Salutation
            ? data.ContactRecord.Salutation.toString()
            : "",
          firstName: data.ContactRecord.Firstname,
          middleName: data.ContactRecord.Middlename,
          lastName: data.ContactRecord.Lastname,
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
          referredBy: data.ContactRecord.ReferredBy,
          servicingAdvisor: data.ContactRecord.ServicingAdvisorID
            ? data.ContactRecord.ServicingAdvisorID.toString()
            : "",
          writingAdvisor: data.ContactRecord.WritingAdvisorID
            ? data.ContactRecord.WritingAdvisorID.toString()
            : "",
          phoneNumbers: data.Phone.map((obj, index) => ({
            key: uuid(),
            phoneNumber: obj.Number,
            type: obj.TypeID,
            primary: obj.Primary,
          })),
          emailAddresses: data.Internet.map((obj, index) => ({
            key: uuid(),
            emailAddress: obj.Address,
            type: obj.Type,
            primary: obj.Primary,
          })),
          streetAddresses: data.Address.map((obj, index) => ({
            key: uuid(),
            streetAddress: obj.Address1,
            secondaryAddress: obj.Address2,
            city: obj.City,
            state: obj.State,
            zip: obj.Zip,
            type: obj.TypeID,
            primary: obj.Primary,
          })),
        });

        setLoadingState(false);
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
          value={selectedContact.id}
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
      <LoadingOverlay active={loadingContact} spinner text="Loading Contact">
        <form className={styles.editPanel} autoComplete="off">
          <div className={styles.formRow}>
            <div className={styles.formColumn}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Family Name</label>
                <input
                  className={styles.formLabelledInput}
                  type="text"
                  name="familyName"
                  onChange={handleChange}
                  value={formData.familyName}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Salutation</label>
                <select
                  className={styles.formLabelledInput}
                  onChange={handleChange}
                  name="salutation"
                  value={formData.salutation}
                >
                  <option value=""></option>
                  {dropdownData.salutations.map((obj, index) => (
                    <option key={index} value={obj.SalutationCode || ""}>
                      {obj.Code || ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>First Name</label>
                <input
                  className={styles.formLabelledInput}
                  type="text"
                  name="firstName"
                  onChange={handleChange}
                  value={formData.firstName}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Middle Name</label>
                <input
                  className={styles.formLabelledInput}
                  type="text"
                  name="middleName"
                  onChange={handleChange}
                  value={formData.middleName}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Last Name</label>
                <input
                  className={styles.formLabelledInput}
                  type="text"
                  name="lastName"
                  onChange={handleChange}
                  value={formData.lastName}
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
                <select
                  className={styles.formLabelledInput}
                  onChange={handleChange}
                  name="category"
                  value={formData.category}
                >
                  <option value=""></option>
                  {dropdownData.categories.map((obj, index) => (
                    <option key={index} value={obj.MCCLCode || ""}>
                      {obj.Code || ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Status</label>
                <select
                  className={styles.formLabelledInput}
                  onChange={handleChange}
                  name="status"
                  value={formData.status}
                >
                  <option value=""></option>
                  {dropdownData.statuses.map((obj, index) => (
                    <option key={index} value={obj.CSLCode || ""}>
                      {obj.Code || ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formColumn}>
              <div className={styles.formRow}>
                <div className={styles.formColumn}>
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Source</label>
                    <select
                      className={styles.formLabelledInput}
                      onChange={handleChange}
                      name="source"
                      value={formData.source}
                    >
                      <option value=""></option>
                      {dropdownData.sources.map((obj, index) => (
                        <option key={index} value={obj.MCSLCode || ""}>
                          {obj.Code || ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Referred By</label>
                    <input
                      className={styles.formLabelledInput}
                      type="text"
                      name="referredBy"
                      onChange={handleChange}
                      value={formData.referredBy}
                    />
                  </div>
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>
                      Servicing Advisor
                    </label>
                    <select
                      className={styles.formLabelledInput}
                      onChange={handleChange}
                      name="servicingAdvisor"
                      value={formData.servicingAdvisor}
                    >
                      <option value=""></option>
                      {dropdownData.servicingAdvisors.map((obj, index) => (
                        <option key={index} value={obj.SALCode || ""}>
                          {obj.Code || ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Writing Advisor</label>
                    <select
                      className={styles.formLabelledInput}
                      onChange={handleChange}
                      name="writingAdvisor"
                      value={formData.writingAdvisor}
                    >
                      <option value=""></option>
                      {dropdownData.writingAdvisors.map((obj, index) => (
                        <option key={index} value={obj.WALCode || ""}>
                          {obj.Code || ""}
                        </option>
                      ))}
                    </select>
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
                    {formData.phoneNumbers.map((obj, index) => (
                      <div className={styles.formRow} key={obj.key}>
                        <input
                          className={styles.formSoloInput}
                          type="text"
                          value={obj.phoneNumber || ""}
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
                          name="phoneNumber"
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
                    {formData.emailAddresses.map((obj, index) => (
                      <div className={styles.formRow} key={obj.key}>
                        <input
                          className={styles.formSoloInput}
                          type="text"
                          value={obj.emailAddress || ""}
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
                          name="emailAddress"
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
                {formData.streetAddresses.map((obj, index) => (
                  <div className={styles.formRow} key={obj.key}>
                    <input
                      className={styles.formSoloInput}
                      type="text"
                      value={obj.streetAddress || ""}
                      onChange={handleChange}
                    />
                    <input
                      className={styles.formSoloInput}
                      type="text"
                      value={obj.secondaryAddress || ""}
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
                      name="streetAddress"
                      value=""
                      defaultChecked={obj.primary || false}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>
      </LoadingOverlay>
    </div>
  );
}

DataCleanupPage.Layout = PageLayout;
