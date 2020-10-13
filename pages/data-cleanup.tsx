import PageLayout from "../layouts/page-layout";
import styles from "../styles/DataCleanupPage.module.scss";
import axios from "axios";
import LoadingOverlay from "react-loading-overlay";
import { useEffect, useState } from "react";
import {
  RedtailContactRec,
  RedtailSettingsData,
  ContactFormData,
  RedtailContactListRec,
} from "../interfaces/redtail.interface";
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
} from "../utils/create-empty-form-data";
import { setLocalStorage } from "../utils/set-local-storage";
import { SelectedContact } from "../interfaces/form.interface";
import TextField from "../components/text-field";
import DropDownField from "../components/drop-down-field";
import EmailFields from "../components/email-field";
import PhoneFields from "../components/phone-field";
import AddressFields from "../components/address-field";
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
            const result = res.data;
            const contacts: RedtailContactListRec[] = result.contacts.Detail;
            const totalCount: number = result.contacts.TotalRecords;
            const pageCount: number = Math.ceil(totalCount / 50);

            updatePageData({
              current_page: 1,
              total_pages: pageCount,
            });

            const formattedContactList = contacts
              .map((contact) => {
                return {
                  id: contact.ClientID,
                  lastName: contact.LastName,
                };
              })
              .sort((a, b) => a.id - b.id);

            setContactList(formattedContactList);
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

  const emptySourceContactRef: Readonly<RedtailContactRec> = createEmptyContactRefData();
  const emptyFormData: Readonly<ContactFormData> = createEmptyFormData();
  const redtailDropDowns: Readonly<RedtailSettingsData> = createEmptyDropDownData();
  const initialSelectedContact: SelectedContact = {
    id: "",
    page: 1,
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
  const [dropdownData, updateDropdownData] = useState(redtailDropDowns);
  const [pageData, updatePageData] = useState({
    current_page: 1,
    total_pages: 1,
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

  // Updates form state for phones, emails, and addresses
  const handleArrChange = (
    index: number,
    arrName: string,
    targetRecId: number
  ) => (e) => {
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
    updateSelectedContact({ id, page: 1 });
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
      .then((res) => {
        setSavingContact(false);
        if (res.status == 200) {
          alert("Submitted Contact!");
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
          pageData={pageData}
          updatePageData={updatePageData}
          dropdownData={dropdownData}
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
                  <TextField
                    label="Family Name"
                    fieldName="familyName"
                    fieldValue={formData.familyName}
                    handleChange={handleChange}
                  ></TextField>

                  <DropDownField
                    label="Salutation"
                    fieldName="salutation"
                    fieldValue={formData.salutation}
                    dropDownItems={dropdownData.salutations}
                    optionLabel="Code"
                    optionValue="SalutationCode"
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
                    optionLabel="Gender"
                    optionValue="Gender"
                    handleChange={handleChange}
                  ></DropDownField>
                </div>

                <div className={styles.formColumn}>
                  <div className={styles.formRow}>
                    <div className={styles.formColumn}>
                      <DropDownField
                        label="Category"
                        fieldName="categoryID"
                        fieldValue={formData.categoryID}
                        dropDownItems={dropdownData.categories}
                        optionLabel="Code"
                        optionValue="MCCLCode"
                        handleChange={handleChange}
                      ></DropDownField>

                      <DropDownField
                        label="Status"
                        fieldName="statusID"
                        fieldValue={formData.statusID}
                        dropDownItems={dropdownData.statuses}
                        optionLabel="Code"
                        optionValue="CSLCode"
                        handleChange={handleChange}
                      ></DropDownField>

                      <DropDownField
                        label="Source"
                        fieldName="sourceID"
                        fieldValue={formData.sourceID}
                        dropDownItems={dropdownData.sources}
                        optionLabel="Code"
                        optionValue="MCSLCode"
                        handleChange={handleChange}
                      ></DropDownField>

                      <TextField
                        label="Referred By"
                        fieldName="referredBy"
                        fieldValue={formData.referredBy}
                        handleChange={handleChange}
                      ></TextField>

                      <DropDownField
                        label="Servicing Advisor"
                        fieldName="servicingAdvisorID"
                        fieldValue={formData.servicingAdvisorID}
                        dropDownItems={dropdownData.servicingAdvisors}
                        optionLabel="Code"
                        optionValue="SALCode"
                        handleChange={handleChange}
                      ></DropDownField>

                      <DropDownField
                        label="Writing Advisor"
                        fieldName="writingAdvisorID"
                        fieldValue={formData.writingAdvisorID}
                        dropDownItems={dropdownData.writingAdvisors}
                        optionLabel="Code"
                        optionValue="WALCode"
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
                    ></EmailFields>
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
                    ></PhoneFields>
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
                  ></AddressFields>
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
