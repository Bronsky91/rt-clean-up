import PageLayout from "../layouts/page-layout";
import styles from "../styles/DataCleanupPage.module.scss";
import axios from "axios";
import LoadingOverlay from "react-loading-overlay";
import { useEffect, useState } from "react";
import { API_URL } from "../constants";
import { useRouter } from "next/router";
import Login from "./login";
import { getContactAndPopulateForm } from "../utils/get-contact-and-populate-form";
import { applyLocalStorage } from "../utils/apply-local-storage";
import { prepareContactSubmitData } from "../utils/prepare-contact-submit-data";
import ContactListPanel from "../components/contact-list-panel";
import {
  createEmptyContactRefData,
  createEmptyFormData,
  createEmptyDropDownData,
  createEmptyContactField,
} from "../utils/create-empty-form-data";
import { setLocalStorage } from "../utils/set-local-storage";
import { SelectedContact } from "../interfaces/form.interface";
import TextField from "../components/text-field";
import DropDownField from "../components/drop-down-field";
import EmailFields from "../components/email-field";
import PhoneFields from "../components/phone-field";
import AddressFields from "../components/address-field";
import DateField from "../components/date-field";
import { RedtailContactListRec } from "../interfaces/redtail-contact-list.interface";
import { RedtailSettingsData } from "../interfaces/redtail-settings.interface";
import { RedtailContactMasterRec } from "../interfaces/redtail-contact.interface";
import { ContactFormData } from "../interfaces/redtail-form.interface";
export default function DataCleanupPage(props) {
  const router = useRouter();
  const isAuth = props.isAuth;

  useEffect(() => {
    // mounted used to avoid issue outlined here: https://www.debuggr.io/react-update-unmounted-component/
    let mounted = true;

    if (isAuth) {
      setLoadingPage(true);
      // If authenticated, load contact data
      axios
        .get(`${API_URL}/rt/get-contacts`, { withCredentials: true })
        .then((res) => {
          if (mounted) {
            const list: RedtailContactListRec = res.data;
            const contacts = list.contacts;
            const totalCount: number = list.meta.total_records;
            const pageCount: number = list.meta.total_pages;

            updatePageData({
              currentPage: 1,
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

            setContactList(formattedContactList);

            // If contacts returned, select first one
            if (formattedContactList && formattedContactList.length >= 1) {
              selectContact(formattedContactList[0].id.toString());
            }
          }

          axios
            .get(API_URL + "/rt/dropdowns", { withCredentials: true })
            .then((res) => {
              if (mounted) {
                const dropdownData: RedtailSettingsData = res.data;
                updateDropdownData(dropdownData);
                setLoadingPage(false);
              }
            });
        });

      // Update Form with LocalStorage if it's available
      applyLocalStorage(
        updateSelectedContact,
        updateSourceContactRef,
        updateFormData,
        updateOriginalFormData,
        updateFormDirty
      );

      return () => {
        mounted = false;
      };
    } else {
      // If unauthenticated, redirect router to login page and clear localStorage
      localStorage.clear();
      router.replace(router.pathname, "/login", { shallow: true });
    }
  }, [isAuth]);

  // If unathenticated, load login component
  if (!isAuth) return <Login />;

  const emptySourceContactRef: Readonly<RedtailContactMasterRec> = createEmptyContactRefData();
  const emptyFormData: Readonly<ContactFormData> = createEmptyFormData();
  const emptyDropDowns: Readonly<RedtailSettingsData> = createEmptyDropDownData();
  const initialSelectedContact: SelectedContact = {
    id: "",
  };

  const [sourceContactRef, updateSourceContactRef] = useState(
    emptySourceContactRef
  );
  const [formData, updateFormData] = useState(emptyFormData);
  const [originalFormData, updateOriginalFormData] = useState(emptyFormData);
  const [formDirty, updateFormDirty] = useState(false);
  const [selectedContact, updateSelectedContact] = useState(
    initialSelectedContact
  );
  const [contactList, setContactList] = useState([]);
  const [dropdownData, updateDropdownData] = useState(emptyDropDowns);
  const [pageData, updatePageData] = useState({
    currentPage: 1,
    totalPages: 1,
    totalContacts: 0,
  });
  const [loadingPage, setLoadingPage] = useState(false);
  const [loadingContact, setLoadingContact] = useState(false);
  const [savingContact, setSavingContact] = useState(false);

  // Saves Form State to Local Storage after each change
  useEffect(() => {
    setLocalStorage(
      selectedContact,
      sourceContactRef,
      originalFormData,
      formData,
      formDirty
    );
  }, [
    selectedContact,
    sourceContactRef,
    formData,
    originalFormData,
    formDirty,
  ]);

  const removeContactField = (fieldName: string, index: number) => (e) => {
    e.preventDefault();

    const newContactFieldArray = formData[fieldName];
    const removedContactField = newContactFieldArray.splice(index, 1);

    const updatedFormData = {
      ...formData,
      [fieldName]: [...newContactFieldArray],
      contactFieldsToDelete: {
        ...formData.contactFieldsToDelete,
        [fieldName]: [
          ...formData.contactFieldsToDelete[fieldName],
          removedContactField[0].recID,
        ],
      },
    };

    updateFormData(updatedFormData);
  };

  const addContactField = (fieldName: string) => (e) => {
    e.preventDefault();

    const updatedFormData = {
      ...formData,
      [fieldName]: [
        ...formData[fieldName],
        createEmptyContactField[fieldName](),
      ],
    };

    updateFormData(updatedFormData);
  };

  // Updates form state for phones, emails, and addresses
  const handleArrChange = (
    index: number,
    arrName: string,
    targetRecId: number
  ) => (e) => {
    console.log("email change");
    const targetName: string = e.target.name;
    const newArr = [...formData[arrName]];
    if (targetName.startsWith("primary")) {
      const checked: boolean = e.target.checked;
      newArr[index][targetName] = checked;
      for (const item of newArr) {
        if (item.recID !== targetRecId) item[targetName] = !checked;
      }
    } else {
      newArr[index][targetName] = e.target.value;
    }

    const updatedFormData = { ...formData, [arrName]: newArr };

    updateFormData(updatedFormData);
    updateFormDirty(
      JSON.stringify(originalFormData) !== JSON.stringify(updatedFormData)
    );
  };

  const handleDateChange = (date: any, fieldName) => {
    updateFormData({ ...formData, [fieldName]: date });
  };

  const handleChange = (e) => {
    e.preventDefault();
    const target = e.target;

    const updatedFormData = { ...formData, [target.name]: target.value.trim() };
    updateFormData(updatedFormData);
    updateFormDirty(
      JSON.stringify(originalFormData) !== JSON.stringify(updatedFormData)
    );
  };

  const contactSelected = (e) => {
    e.preventDefault();
    setLoadingContact(true);

    const id = e.target.value;
    updateSelectedContact({ id });
    getContactAndPopulateForm(
      updateSourceContactRef,
      updateFormData,
      updateOriginalFormData,
      updateFormDirty,
      formData,
      id
    ).then(() => {
      setLoadingContact(false);
    });
  };

  const selectContact = (id: string) => {
    setLoadingContact(true);
    updateSelectedContact({ id });
    getContactAndPopulateForm(
      updateSourceContactRef,
      updateFormData,
      updateOriginalFormData,
      updateFormDirty,
      formData,
      id
    ).then(() => {
      setLoadingContact(false);
    });
  };

  const handleUndo = (e) => {
    e.preventDefault();
    updateFormData(originalFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSavingContact(true);
    axios
      .post(
        API_URL + "/rt/contact-submit",
        { data: prepareContactSubmitData(formData, sourceContactRef) },
        { withCredentials: true }
      )
      .then(async (res) => {
        setSavingContact(false);
        if (res.status == 200) {
          // Reload contact page from Redtail as a data validation measure
          selectContact(sourceContactRef.ContactRecord.ClientID.toString());
          alert("Contact Saved!");
        } else {
          alert(
            "ERROR (HTTP " +
              res.status.toString() +
              ")\nPlease wait and try again later."
          );
        }
      });
  };

  return (
    <LoadingOverlay
      active={loadingPage}
      spinner
      text="Gathering Contacts from Redtail..."
    >
      <div className={styles.container}>
        <ContactListPanel
          contactSelected={contactSelected}
          selectedContact={selectedContact}
          contactList={contactList}
          setContactList={setContactList}
          pageData={pageData}
          updatePageData={updatePageData}
          dropdownData={dropdownData}
          setLoadingPage={setLoadingPage}
          selectContact={selectContact}
        ></ContactListPanel>
        <LoadingOverlay active={savingContact} spinner text="Saving Contact">
          <LoadingOverlay
            active={loadingContact}
            spinner
            text="Loading Contact"
          >
            <form
              className={styles.editPanel}
              autoComplete="off"
              onSubmit={handleSubmit}
            >
              <div className={styles.formRow}>
                <div className={styles.formColumn}>
                  <DropDownField
                    label="Salutation"
                    fieldName="salutation"
                    fieldValue={formData.salutation}
                    dropDownItems={dropdownData.salutations}
                    handleChange={handleChange}
                  ></DropDownField>

                  <TextField
                    label="First Name"
                    fieldName="firstName"
                    fieldValue={formData.firstName}
                    handleChange={handleChange}
                  ></TextField>

                  <TextField
                    label="Middle Name"
                    fieldName="middleName"
                    fieldValue={formData.middleName}
                    handleChange={handleChange}
                  ></TextField>

                  <TextField
                    label="Last Name"
                    fieldName="lastName"
                    fieldValue={formData.lastName}
                    handleChange={handleChange}
                  ></TextField>

                  <TextField
                    label="Nickname"
                    fieldName="nickname"
                    fieldValue={formData.nickname}
                    handleChange={handleChange}
                  ></TextField>

                  <DropDownField
                    label="Gender"
                    fieldName="gender"
                    fieldValue={formData.gender}
                    dropDownItems={dropdownData.gender}
                    handleChange={handleChange}
                  ></DropDownField>

                  <DateField
                    label="Date of Birth"
                    fieldName="dateOfBirth"
                    fieldValue={formData.dateOfBirth}
                    handleDateChange={handleDateChange}
                  ></DateField>
                </div>

                <div className={styles.formColumn}>
                  <div className={styles.formRow}>
                    <div className={styles.formColumn}>
                      <DropDownField
                        label="Category"
                        fieldName="categoryID"
                        fieldValue={formData.categoryID}
                        dropDownItems={dropdownData.category_id}
                        handleChange={handleChange}
                      ></DropDownField>

                      <DropDownField
                        label="Status"
                        fieldName="statusID"
                        fieldValue={formData.statusID}
                        dropDownItems={dropdownData.status_id}
                        handleChange={handleChange}
                      ></DropDownField>

                      <DropDownField
                        label="Source"
                        fieldName="sourceID"
                        fieldValue={formData.sourceID}
                        dropDownItems={dropdownData.source_id}
                        handleChange={handleChange}
                      ></DropDownField>

                      <TextField
                        label="Tax ID"
                        fieldName="taxID"
                        fieldValue={formData.taxID}
                        handleChange={handleChange}
                      ></TextField>

                      <DropDownField
                        label="Servicing Advisor"
                        fieldName="servicingAdvisorID"
                        fieldValue={formData.servicingAdvisorID}
                        dropDownItems={dropdownData.servicingAdvisors}
                        handleChange={handleChange}
                      ></DropDownField>

                      <DropDownField
                        label="Writing Advisor"
                        fieldName="writingAdvisorID"
                        fieldValue={formData.writingAdvisorID}
                        dropDownItems={dropdownData.writingAdvisors}
                        handleChange={handleChange}
                      ></DropDownField>
                    </div>

                    {/* Place holder fields for DOB and Tax ID at last */}
                    <div className={styles.formColumn}>
                      <TextField
                        label="Place Holder"
                        fieldName="referredBy"
                        fieldValue=""
                        handleChange={handleChange}
                      ></TextField>
                      <TextField
                        label="Place Holder"
                        fieldName="referredBy"
                        fieldValue=""
                        handleChange={handleChange}
                      ></TextField>
                    </div>
                    {/* -------- */}

                    <div className={styles.formColumn}>
                      <div className={styles.saveButtonContainer}>
                        <button type="submit" className={styles.saveButton}>
                          SAVE
                        </button>
                        <button
                          className={styles.undoButton}
                          onClick={handleUndo}
                        >
                          UNDO
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formRow}>
                  <div className={styles.formColumn}>
                    <div className={styles.formRow}>
                      <div className={styles.formHeader}>
                        <label className={styles.formLabel}>
                          Email Address
                        </label>
                      </div>
                      <div className={styles.formHeader}>
                        <label className={styles.formLabel}>Type</label>
                      </div>
                      <div className={styles.formHeader}>
                        <label className={styles.formLabel}>Primary?</label>
                      </div>
                    </div>
                    <EmailFields
                      emails={formData.emailAddresses}
                      handleArrChange={handleArrChange}
                      dropdownData={dropdownData}
                      removeContactField={removeContactField}
                    ></EmailFields>
                    <button onClick={addContactField("emailAddresses")}>
                      Add
                    </button>
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
                    <PhoneFields
                      phoneNumbers={formData.phoneNumbers}
                      handleArrChange={handleArrChange}
                      dropdownData={dropdownData}
                      removeContactField={removeContactField}
                    ></PhoneFields>
                    <button onClick={addContactField("phoneNumbers")}>
                      Add
                    </button>
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
                      <label className={styles.formLabel}>
                        Secondary Address
                      </label>
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
                  <AddressFields
                    streetAddresses={formData.streetAddresses}
                    handleArrChange={handleArrChange}
                    dropdownData={dropdownData}
                    removeContactField={removeContactField}
                  ></AddressFields>
                  <button onClick={addContactField("streetAddresses")}>
                    Add
                  </button>
                </div>
              </div>
            </form>
          </LoadingOverlay>
        </LoadingOverlay>
      </div>
    </LoadingOverlay>
  );
}

DataCleanupPage.Layout = PageLayout;
