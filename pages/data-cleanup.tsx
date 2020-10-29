import PageLayout from "../layouts/page-layout";
import styles from "../styles/DataCleanupPage.module.scss";
import axios from "axios";
import LoadingOverlay from "react-loading-overlay";
import { useEffect, useRef, useState } from "react";
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
import { RedtailContactRec } from "../interfaces/redtail-contact.interface";
import { ContactFormData } from "../interfaces/redtail-form.interface";
import DashboardPage from ".";
export default function DataCleanupPage(props) {
  const router = useRouter();
  const isAuth = props.isAuth;
  const isRedtailAuth = props.rtAuth;

  useEffect(() => {
    // mounted used to avoid issue outlined here: https://www.debuggr.io/react-update-unmounted-component/
    let mounted = true;

    if (isAuth && isRedtailAuth) {
      setLoadingPage(true);
      // If authenticated, load contact data
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/rt/get-contacts`, {
          withCredentials: true,
        })
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
            .get(`${process.env.NEXT_PUBLIC_API_URL}/rt/dropdowns`, {
              withCredentials: true,
            })
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
    } else if (!isRedtailAuth) {
      // If unauthenticated with Redtail, redirect router to dashboard page and clear localStorage
      localStorage.clear();
      router.replace(router.pathname, "/", { shallow: true });
    } else {
      // If unauthenticated, redirect router to login page and clear localStorage
      localStorage.clear();
      router.replace(router.pathname, "/login", { shallow: true });
    }
  }, [isAuth, isRedtailAuth]);

  // If unathenticated, load login component
  if (!isAuth) return <Login />;

  // If unathenticated with Redtail, load Dashboard component
  if (!isRedtailAuth) return <DashboardPage {...props} />;

  const emptySourceContactRef: Readonly<RedtailContactRec> = createEmptyContactRefData();
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
  const contactsPerPage = 50;
  const [selectedContact, updateSelectedContact] = useState(
    initialSelectedContact
  );
  const [contactList, setContactList] = useState([]);
  const [filteredContactList, setFilteredContactList] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [filterPageData, setFilterPageData] = useState({
    currentPage: 1,
    totalPages: 1,
    startIndex: 0,
    endIndex: contactsPerPage,
  });
  const [pageData, updatePageData] = useState({
    currentPage: 1,
    totalPages: 1,
    totalContacts: 0,
  });
  const pageInput = useRef(null);
  const [pageInputText, setPageInputText] = useState("");
  const [dropdownData, updateDropdownData] = useState(emptyDropDowns);
  const [loadingPage, setLoadingPage] = useState(false);
  const [loadingContact, setLoadingContact] = useState(false);
  const [savingContact, setSavingContact] = useState(false);
  const [contactPrevDisabled, setContactPrevDisabled] = useState(false);
  const [contactNextDisabled, setContactNextDisabled] = useState(false);

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

  // When contact changes, re-calculate prev & next contact button disabled state
  useEffect(() => {
    const contactIndex: number = isFiltered
      ? filteredContactList
          .map((contact) => contact.id)
          .indexOf(sourceContactRef.id)
      : contactList.map((contact) => contact.id).indexOf(sourceContactRef.id);

    setContactPrevDisabled(
      isFiltered
        ? contactIndex <= 0
        : contactIndex <= 0 && pageData.currentPage == 1
    );

    setContactNextDisabled(
      isFiltered
        ? contactIndex === -1 || contactIndex === filteredContactList.length - 1
        : contactIndex === -1 ||
            contactIndex + (pageData.currentPage - 1) * contactsPerPage ===
              pageData.totalContacts - 1
    );
  }, [sourceContactRef]);

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

  const changePage = (updatedPage: number, selectContactIndex: number = 0) => {
    setLoadingPage(true);

    pageInput.current.value = updatedPage.toString();
    setPageInputText(updatedPage.toString());

    if (isFiltered) {
      const startIndex = contactsPerPage * updatedPage - contactsPerPage;
      setFilterPageData({
        ...filterPageData,
        currentPage: updatedPage,
        startIndex: startIndex,
        endIndex: contactsPerPage * updatedPage,
      });
      // After loading page, select contact
      if (filteredContactList && filteredContactList[startIndex]) {
        selectContact(
          filteredContactList[startIndex + selectContactIndex].id.toString()
        );
      }
      setLoadingPage(false);
    } else {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/rt/get-contacts?page=${updatedPage}`,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          const list: RedtailContactListRec = res.data;
          const contacts = list.contacts;
          const totalCount: number = list.meta.total_records;
          const pageCount: number = list.meta.total_pages;

          updatePageData({
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

          setContactList(formattedContactList);
          // Select contact after they are returned
          if (formattedContactList && formattedContactList.length >= 1) {
            selectContact(
              formattedContactList[selectContactIndex].id.toString()
            );
          }
          setLoadingPage(false);
        });
    }
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
        `${process.env.NEXT_PUBLIC_API_URL}/rt/contact-submit`,
        { data: prepareContactSubmitData(formData, sourceContactRef) },
        { withCredentials: true }
      )
      .then(async (res) => {
        setSavingContact(false);
        if (res.status == 200) {
          // Update contact list entry to ensure last name is current
          if (isFiltered) {
            setFilteredContactList(
              filteredContactList.map((contact) =>
                contact.id === sourceContactRef.id
                  ? { ...contact, lastName: formData.lastName }
                  : contact
              )
            );
          } else {
            setContactList(
              contactList.map((contact) =>
                contact.id === sourceContactRef.id
                  ? { ...contact, lastName: formData.lastName }
                  : contact
              )
            );
          }
          // Reload contact page from Redtail as a data validation measure
          selectContact(sourceContactRef.id.toString());

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

  const handleContactPrevClick = (e) => {
    e.preventDefault();

    const contactIndex: number = isFiltered
      ? filteredContactList
          .map((contact) => contact.id)
          .indexOf(sourceContactRef.id)
      : contactList.map((contact) => contact.id).indexOf(sourceContactRef.id);
    if (contactIndex === -1) return; // -1 indicates current contact's ID was not found in contact list

    if (isFiltered) {
      // filteredContactList contains ALL contacts spread across all pages,
      // so we can use index to calculate page and change if necessary before selecting new contact
      const newPage: number =
        Math.ceil(contactIndex / contactsPerPage) < 1
          ? 1
          : Math.ceil(contactIndex / contactsPerPage);
      if (newPage < filterPageData.currentPage) {
        changePage(newPage, contactsPerPage - 1);
      } else if (newPage == filterPageData.currentPage) {
        selectContact(filteredContactList[contactIndex - 1].id);
      }
    } else {
      // contactList only contains contacts for the current page,
      // so we have to determine if we need to change the page a little differently
      if (contactIndex == 0 && pageData.currentPage > 1) {
        changePage(pageData.currentPage - 1, contactsPerPage - 1);
      } else if (contactIndex > 0) {
        selectContact(contactList[contactIndex - 1].id);
      }
    }
  };

  const handleContactNextClick = (e) => {
    e.preventDefault();

    const contactIndex: number = isFiltered
      ? filteredContactList
          .map((contact) => contact.id)
          .indexOf(sourceContactRef.id)
      : contactList.map((contact) => contact.id).indexOf(sourceContactRef.id);
    if (contactIndex === -1) return; // -1 indicates current contact's ID was not found in contact list

    if (isFiltered) {
      // filteredContactList contains ALL contacts spread across all pages,
      // so we can use index to calculate page and change if necessary before selecting new contact
      const newPage: number = Math.ceil((contactIndex + 2) / contactsPerPage);
      if (newPage > filterPageData.currentPage) {
        changePage(newPage, 0);
      } else if (newPage == filterPageData.currentPage) {
        selectContact(filteredContactList[contactIndex + 1].id);
      }
    } else {
      // contactList only contains contacts for the current page,
      // so we have to determine if we need to change the page a little differently
      if (
        contactIndex == contactsPerPage - 1 &&
        pageData.currentPage < pageData.totalPages
      ) {
        changePage(pageData.currentPage + 1, 0);
      } else if (contactIndex < contactsPerPage - 1) {
        selectContact(contactList[contactIndex + 1].id);
      }
    }
  };

  return (
    <LoadingOverlay
      active={loadingPage}
      spinner
      text="Gathering Contacts from Redtail..."
    >
      <div className={styles.container}>
        <ContactListPanel
          contactsPerPage={contactsPerPage}
          contactSelected={contactSelected}
          selectedContact={selectedContact}
          contactList={contactList}
          setContactList={setContactList}
          filteredContactList={filteredContactList}
          setFilteredContactList={setFilteredContactList}
          isFiltered={isFiltered}
          setIsFiltered={setIsFiltered}
          filterPageData={filterPageData}
          setFilterPageData={setFilterPageData}
          pageData={pageData}
          updatePageData={updatePageData}
          changePage={changePage}
          pageInput={pageInput}
          pageInputText={pageInputText}
          setPageInputText={setPageInputText}
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
                    fieldName="salutationID"
                    fieldValue={formData.salutationID}
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
                    fieldName="genderID"
                    fieldValue={formData.genderID}
                    dropDownItems={dropdownData.genderTypes}
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
                <div className={styles.formRow}>
                  <div
                    className={`${styles.formColumn} ${styles.buttonColumn}`}
                  >
                    <div className={styles.buttonRow}>
                      <button
                        className={styles.contactPrevButton}
                        onClick={handleContactPrevClick}
                        disabled={contactPrevDisabled}
                      />

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

                      <button
                        className={styles.contactNextButton}
                        onClick={handleContactNextClick}
                        disabled={contactNextDisabled}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formRow}>
                  <div className={styles.formColumn}>
                    <div className={styles.formRow}>
                      <div className={styles.formHeaderLong}>
                        <label className={styles.formHeaderLabelLong}>
                          Email Address
                        </label>
                      </div>
                      <div className={styles.formHeaderShort}>
                        <label className={styles.formHeaderLabelShort}>
                          Type
                        </label>
                      </div>
                      <div className={styles.formHeader}>
                        <label className={styles.formHeaderLabel}>
                          Primary?
                        </label>
                      </div>
                    </div>
                    <EmailFields
                      emails={formData.emails}
                      handleArrChange={handleArrChange}
                      dropdownData={dropdownData}
                      removeContactField={removeContactField}
                    ></EmailFields>
                    <div className={styles.formRowEven}>
                      <button
                        className={styles.addButton}
                        onClick={addContactField("emailAddresses")}
                      />
                    </div>
                  </div>
                  <div className={styles.formColumn}>
                    <div className={styles.formRow}>
                      <div className={styles.formHeader}>
                        <label className={styles.formLabel}>Phone Number</label>
                      </div>
                      <div className={styles.formHeaderShort}>
                        <label className={styles.formHeaderLabelShort}>
                          Type
                        </label>
                      </div>
                      <div className={styles.formHeader}>
                        <label className={styles.formLabel}>Primary?</label>
                      </div>
                    </div>
                    <PhoneFields
                      phoneNumbers={formData.phones}
                      handleArrChange={handleArrChange}
                      dropdownData={dropdownData}
                      removeContactField={removeContactField}
                    ></PhoneFields>
                    <div className={styles.formRowEven}>
                      <button
                        className={styles.addButton}
                        onClick={addContactField("phoneNumbers")}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formColumn}>
                  <div className={styles.formRow}>
                    <div className={styles.formHeaderLong}>
                      <label className={styles.formHeaderLabelLong}>
                        Street Address
                      </label>
                    </div>
                    <div className={styles.formHeaderLong}>
                      <label className={styles.formHeaderLabelLong}>
                        Secondary Address
                      </label>
                    </div>
                    <div className={styles.formHeader}>
                      <label className={styles.formHeaderLabel}>City</label>
                    </div>
                    <div className={styles.formHeaderShort}>
                      <label className={styles.formHeaderLabelShort}>
                        State
                      </label>
                    </div>
                    <div className={styles.formHeader}>
                      <label className={styles.formHeaderLabel}>Zip</label>
                    </div>
                    <div className={styles.formHeader}>
                      <label className={styles.formHeaderLabel}>Type</label>
                    </div>
                    <div className={styles.formHeader}>
                      <label className={styles.formHeaderLabel}>Primary?</label>
                    </div>
                  </div>
                  <AddressFields
                    streetAddresses={formData.addresses}
                    handleArrChange={handleArrChange}
                    dropdownData={dropdownData}
                    removeContactField={removeContactField}
                  ></AddressFields>
                  <div className={styles.formRowEven}>
                    <button
                      className={styles.addButton}
                      onClick={addContactField("streetAddresses")}
                    />
                  </div>
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
