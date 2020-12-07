import PageLayout from "../layouts/page-layout";
import styles from "../styles/DataCleanupPage.module.scss";
import axios from "axios";
import LoadingOverlay from "react-loading-overlay";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Login from "./login";
import { getContactAndPopulateForm } from "../utils/get-contact-and-populate-form";
import { applyLocalStorage } from "../utils/apply-local-storage";
import ContactListPanel from "../components/contact-list-panel";
import {
  createEmptyFormData,
  createEmptyDropDownData,
  createEmptyContactField,
  createEmptyContactList,
  createEmptyFilterPageData,
  createEmptyPageData,
  createEmptyFilterData,
} from "../utils/create-empty-form-data";
import { setLocalStorage } from "../utils/set-local-storage";
import TextField from "../components/text-field";
import DropDownField from "../components/drop-down-field";
import AddressFields from "../components/address-fields";
import EmailFields from "../components/email-fields";
import PhoneFields from "../components/phone-fields";
import UrlFields from "../components/url-fields";
import DateField from "../components/date-field";
import {
  ContactListEntry,
  FilterData,
  FilterPageData,
  PageData,
  RedtailContactListRec,
} from "../interfaces/redtail-contact-list.interface";
import { RedtailSettingsData } from "../interfaces/redtail-settings.interface";
import { ContactSpinner } from "../interfaces/linkpoint-form-interface";
import {
  ContactTypes,
  RedtailContactUpdate,
} from "../interfaces/redtail-contact-update.interface";
import DashboardPage from ".";
import { isIndividual } from "../utils/isIndividual";
import {
  dateToDatestring,
  redtailDateToFormatedString,
} from "../utils/date-conversion";
import {
  contactRecordSchema,
  isAllAddressValid,
  isAllEmailValid,
  isAllPhoneValid,
  isAllUrlValid,
} from "../utils/form-validation";
import ContactInterceptModal from "../components/modals/contact-intercept-modal";
import DeleteContactModal from "../components/modals/delete-contact-modal";

export default function DataCleanupPage(props) {
  const router = useRouter();
  const isAuth = props.isAuth;
  const isRedtailAuth = props.rtAuth;
  const pageInput = useRef(null);
  const contactsPerPage = 50;
  const emptyFormData: Readonly<RedtailContactUpdate> = createEmptyFormData();
  const emptyDropDowns: Readonly<RedtailSettingsData> = createEmptyDropDownData();
  const emptyFilterData: Readonly<FilterData[]> = createEmptyFilterData();
  const emptyFilterPageData: Readonly<FilterPageData> = createEmptyFilterPageData();
  const emptyPageData: Readonly<PageData> = createEmptyPageData();
  const emptyContactList: Readonly<
    ContactListEntry[]
  > = createEmptyContactList();
  const emptyContactSpinner: ContactSpinner = { on: false };

  const [formData, setFormData] = useState(emptyFormData);
  const [originalFormData, setOriginalFormData] = useState(emptyFormData);
  const [contactList, setContactList] = useState(emptyContactList);
  const [filteredContactList, setFilteredContactList] = useState(
    emptyContactList
  );
  const [isSaved, setIsSaved] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);
  const [clearFilter, setClearFilter] = useState(false);
  const [filterPageData, setFilterPageData] = useState(emptyFilterPageData);
  const [pageData, setPageData] = useState(emptyPageData);
  const [pageInputText, setPageInputText] = useState("");
  const [dropdownData, setDropdownData] = useState(emptyDropDowns);
  const [loadingPage, setLoadingPage] = useState(true);
  const [contactSpinner, setContactSpinner] = useState(emptyContactSpinner);
  const [contactPrevDisabled, setContactPrevDisabled] = useState(false);
  const [contactNextDisabled, setContactNextDisabled] = useState(false);
  const [contactDeleted, setContactDeleted] = useState(false);
  const [contactDeletedNewIndex, setContactDeletedNewIndex] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("status_id");
  const [filterData, setFilterData] = useState(emptyFilterData);
  const [appliedFilterData, setAppliedFilterData] = useState(emptyFilterData);
  const [isFilterDirty, setIsFilterDirty] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedContactID, setSelectedContactID] = useState(0);
  const [isLocalStorageValid, setIsLocalStorageValid] = useState(false);
  const [localStorageApplied, setLocalStorageApplied] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);

  const [
    isContactInterceptProceedPrev,
    setIsContactInterceptProceedPrev,
  ] = useState(false);

  const [
    contactInterceptModalIsOpen,
    setContactInterceptModalIsOpen,
  ] = useState(false);
  const openContactInterceptModal = () => {
    setContactInterceptModalIsOpen(true);
  };
  const closeContactInterceptModal = () => {
    setContactInterceptModalIsOpen(false);
  };

  const [deleteContactModalIsOpen, setDeleteContactModalIsOpen] = useState(
    false
  );
  const openDeleteContactModal = () => {
    setDeleteContactModalIsOpen(true);
  };
  const closeDeleteContactModal = () => {
    setDeleteContactModalIsOpen(false);
  };

  useEffect(() => {
    // If authenticated, check LocalStorage for Form data, then load contact data in localStorageApplied useEffect hook
    if (isAuth && isRedtailAuth) {
      setLoadingPage(true);

      // Update Form from LocalStorage if it's available
      applyLocalStorage(
        setOriginalFormData,
        setFormData,
        setContactList,
        setFilteredContactList,
        setIsFiltered,
        setFilterPageData,
        setPageData,
        setPageInputText,
        setContactPrevDisabled,
        setContactNextDisabled,
        setSelectedFilter,
        setFilterData,
        setAppliedFilterData,
        setShowFilters,
        setSelectedContactID,
        setDropdownData,
        setIsLocalStorageValid,
        setLocalStorageApplied
      );
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

  useEffect(() => {
    // Do not load contacts from Redtail if not actively authenticated
    if (!isAuth || !isRedtailAuth) {
      setLoadingPage(false);
      return;
    }

    // Likewise, do not load contacts if LocalStorage has not been applied yet
    if (!localStorageApplied) return;

    // Only load clean slate data from Redtail if valid data was not in Local Storage
    if (isLocalStorageValid) {
      setLoadingPage(false);
    } else {
      // This 'mounted' boolean used to avoid issue outlined here: https://www.debuggr.io/react-update-unmounted-component/
      let mounted = true;

      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/rt/get-contacts?page=${
            isFiltered ? filterPageData.currentPage : pageData.currentPage
          }`,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          if (mounted) {
            const list: RedtailContactListRec = res.data;
            const contacts = list.contacts;
            const totalCount: number = list.meta.total_records;
            const pageCount: number = list.meta.total_pages;

            setPageData({
              currentPage: 1,
              totalPages: pageCount,
              totalContacts: totalCount,
            });

            const formattedContactList: ContactListEntry[] = contacts
              .map((contact) => {
                return {
                  id: contact.id,
                  name:
                    contact.type === ContactTypes.Individual
                      ? contact.last_name
                      : contact.company_name,
                };
              })
              .sort((a, b) => a.id - b.id);

            setContactList(formattedContactList);

            // If contacts returned, select first one
            if (formattedContactList && formattedContactList.length >= 1) {
              selectContact(formattedContactList[0].id);
            }
          }

          axios
            .get(`${process.env.NEXT_PUBLIC_API_URL}/rt/dropdowns`, {
              withCredentials: true,
            })
            .then((res) => {
              if (mounted) {
                const dropdownData: RedtailSettingsData = res.data;
                setDropdownData(dropdownData);
                setLoadingPage(false);
              }
            });
        });

      return () => {
        mounted = false;
      };
    }
  }, [localStorageApplied]);

  // If unathenticated, load login component
  if (!isAuth) return <Login />;

  // If unathenticated with Redtail, load Dashboard component
  if (!isRedtailAuth) return <DashboardPage {...props} />;

  // Updates form dirty flag every time form data changes
  useEffect(() => {
    const dirty: boolean =
      JSON.stringify(originalFormData) !== JSON.stringify(formData);
    props.setIsFormDirty(dirty);

    // When form is dirtied reset saved message
    if (dirty) setIsSaved(false);
  }, [originalFormData, formData]);

  // Updates filter dirty flag every time filter data is updated
  useEffect(() => {
    setIsFilterDirty(
      JSON.stringify(appliedFilterData) !== JSON.stringify(filterData)
    );
  }, [appliedFilterData, filterData]);

  // Saves Form State to Local Storage after each change
  useEffect(() => {
    // Only update LocalStorage values after we're done loading from LocalStorage
    if (localStorageApplied) {
      setLocalStorage(
        originalFormData,
        formData,
        contactList,
        filteredContactList,
        isFiltered,
        filterPageData,
        pageData,
        pageInputText,
        contactPrevDisabled,
        contactNextDisabled,
        selectedFilter,
        filterData,
        appliedFilterData,
        showFilters,
        selectedContactID,
        dropdownData
      );
    }
  }, [
    originalFormData,
    formData,
    contactList,
    filteredContactList,
    isFiltered,
    filterPageData,
    pageData,
    pageInputText,
    contactPrevDisabled,
    contactNextDisabled,
    selectedFilter,
    filterData,
    appliedFilterData,
    showFilters,
    selectedContactID,
    dropdownData,
  ]);

  // When formData changes, re-run validity checks
  useEffect(() => {
    let allValid = true;
    if (formData) {
      if (formData.contactRecord) {
        allValid = contactRecordSchema.isValidSync(formData.contactRecord);
        console.log(`Last Name and TaxID are Valid: ${allValid}`);
        console.log(formData.contactRecord);
      }
      if (formData.addresses && allValid) {
        allValid = isAllAddressValid(formData.addresses);
        console.log(`Addresses are Valid: ${allValid}`);
        console.log(formData.addresses);
      }
      if (formData.emails && allValid) {
        allValid = isAllEmailValid(formData.emails);
        console.log(`Emails are Valid: ${allValid}`);
        console.log(formData.emails);
      }
      if (formData.phones && allValid) {
        allValid = isAllPhoneValid(formData.phones);
        console.log(`Phones are Valid: ${allValid}`);
        console.log(formData.phones);
      }
      if (formData.urls && allValid) {
        allValid = isAllUrlValid(formData.urls);
        console.log(`Websites are Valid: ${allValid}`);
        console.log(formData.urls);
      }
      console.log(`All form valid: ${allValid}`);
      console.log(formData);
      console.log(`--------------------------------------------`);
    }
    setIsFormValid(allValid);
  }, [formData]);

  // When contact changes, re-calculate prev & next contact button disabled state
  useEffect(() => {
    const contactIndex: number = isFiltered
      ? filteredContactList
          .map((contact) => contact.id)
          .indexOf(originalFormData.contactRecord.id)
      : contactList
          .map((contact) => contact.id)
          .indexOf(originalFormData.contactRecord.id);

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
  }, [originalFormData]);

  const removeContactField = (fieldName: string, index: number) => (e) => {
    e.preventDefault();

    const newContactFieldArray = formData[fieldName];
    const removedContactField = newContactFieldArray.splice(index, 1);

    if (removedContactField[0].id === 0) {
      // If the deleted contact field was new, splice it from formData
      const updatedFormData = {
        ...formData,
        [fieldName]: [...newContactFieldArray],
      };
      setFormData(updatedFormData);
    } else {
      // Otherwise, if the deleted contact field came from Redtail, queue it for API deletion on save
      const updatedFormData = {
        ...formData,
        [fieldName]: [...newContactFieldArray],
        contactFieldsToDelete: {
          ...formData.contactFieldsToDelete,
          [fieldName]: [
            ...formData.contactFieldsToDelete[fieldName],
            removedContactField[0].id,
          ],
        },
      };
      setFormData(updatedFormData);
    }
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

    setFormData(updatedFormData);
  };

  // Updates form state for phones, emails, and addresses
  const handleArrChange = (
    index: number,
    arrName: string,
    targetID: number,
    value?: string
  ) => (e) => {
    const targetName: string = e.target.name;
    const targetValue: string = value !== undefined ? value : e.target.value;
    const newArr = [...formData[arrName]];

    if (targetName.startsWith("is_primary")) {
      const checked: boolean = e.target.checked;
      newArr[index]["is_primary"] = checked;
      for (const item of newArr) {
        if (item.id !== targetID) item["is_primary"] = !checked;
      }
    } else {
      newArr[index][targetName] = targetValue;
    }

    const updatedFormData = { ...formData, [arrName]: newArr };

    setFormData(updatedFormData);
  };

  const handlePhoneChange = (index: number) => (value, country) => {
    const newArr = [...formData["phones"]];
    newArr[index]["number"] = value;
    newArr[index]["country_code"] = country.dialCode;

    const updatedFormData = { ...formData, ["phones"]: newArr };

    setFormData(updatedFormData);
  };

  const handleDateChange = (date: Date, fieldName: string) => {
    const updatedFormData = {
      ...formData,
      contactRecord: {
        ...formData.contactRecord,
        [fieldName]: dateToDatestring(date), // Convert from datepicker Date object to Redtail yyyy-MM-dd datestring
      },
    };

    setFormData(updatedFormData);
  };

  const handleChange = (e) => {
    e.preventDefault();
    const target = e.target;

    const updatedFormData = {
      ...formData,
      contactRecord: {
        ...formData.contactRecord,
        [target.name]: target.value,
      },
    };
    setFormData(updatedFormData);
  };

  const handleContactChange = (e) => {
    e.preventDefault();
    const id: number = Number(e.target.value);
    selectContact(id);
  };

  const selectContact = (id: number, saved?: boolean) => {
    setContactSpinner({ on: true, msg: "Loading Contact" });
    setSelectedContactID(id);
    getContactAndPopulateForm(
      setOriginalFormData,
      setFormData,
      formData,
      id
    ).then(() => {
      setContactSpinner({ on: false });
      setIsSaved(saved);
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
        selectContact(filteredContactList[startIndex + selectContactIndex].id);
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

          setPageData({
            currentPage: updatedPage,
            totalPages: pageCount,
            totalContacts: totalCount,
          });

          const formattedContactList: ContactListEntry[] = contacts
            .map((contact) => {
              return {
                id: contact.id,
                name: contact.last_name,
              };
            })
            .sort((a, b) => a.id - b.id);

          setContactList(formattedContactList);
          // Select contact after they are returned
          if (formattedContactList && formattedContactList.length >= 1) {
            selectContact(formattedContactList[selectContactIndex].id);
          }
          setLoadingPage(false);
        });
    }
  };

  const handleUndo = (e) => {
    e.preventDefault();
    setFormData(JSON.parse(JSON.stringify(originalFormData))); // force pass by val not ref
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveContact();
  };

  const handleDelete = (e) => {
    e.preventDefault();
    openDeleteContactModal();
  };

  useEffect(() => {
    // when contact is flagged as deleted, reload appropriate new page and contact index
    if (contactDeleted) {
      changePage(
        isFiltered ? filterPageData.currentPage : pageData.currentPage,
        contactDeletedNewIndex
      );
      setContactDeleted(false);
    }
  }, [contactDeleted]);

  const deleteContact = async () => {
    const deleteID = formData.contactRecord.id;
    // process deletion
    setContactSpinner({ msg: "Deleting Contact", on: true });
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/rt/delete-contact?id=${deleteID}`,
      { withCredentials: true }
    );
    setContactSpinner({ on: false });
    if (res.status === 200) {
      // refresh contact data to clear out deleted contact
      if (isFiltered) {
        const currentIndex = filteredContactList.findIndex(
          (contact) => contact.id === formData.contactRecord.id
        );
        const isLastContact = currentIndex === filteredContactList.length - 1;
        const isFirstContactOnPage = currentIndex === filterPageData.startIndex;

        // if contact is at the end of the list as well as the first (and thus only) contact on the current page, the page will need rolled back 1
        const updatedPage =
          isLastContact && isFirstContactOnPage
            ? filterPageData.currentPage - 1
            : filterPageData.currentPage;
        const startIndex = contactsPerPage * updatedPage - contactsPerPage;

        // if contact is at the end of the list, index should roll back 1, otherwise stay the same
        setContactDeletedNewIndex(
          isLastContact
            ? currentIndex - 1 - startIndex
            : currentIndex - startIndex
        );

        // update filtered page data and contact list, then set contactDeleted to true so changePage can be called after new values have rendered
        setFilterPageData({
          ...filterPageData,
          currentPage: updatedPage,
          startIndex: startIndex,
          endIndex: contactsPerPage * updatedPage,
        });
        setFilteredContactList(
          filteredContactList.filter((contact) => {
            return contact.id !== deleteID;
          })
        );
      } else {
        const currentIndex = contactList.findIndex(
          (contact) => contact.id === formData.contactRecord.id
        );
        const isLastContact =
          currentIndex +
            pageData.currentPage * contactsPerPage -
            contactsPerPage ===
          pageData.totalContacts - 1;
        const isFirstContactOnPage = currentIndex === 0;

        // if contact is at end of the list and the first on a subsequent page, index needs set to prior page's final contact and page needs rolled back 1
        setContactDeletedNewIndex(
          isLastContact
            ? isFirstContactOnPage
              ? pageData.currentPage > 1
                ? contactsPerPage - 1
                : 0
              : currentIndex - 1
            : currentIndex
        );
        const updatedPage =
          isLastContact && isFirstContactOnPage
            ? pageData.currentPage - 1
            : pageData.currentPage;
        setPageData({
          ...pageData,
          currentPage: updatedPage,
        });
      }
      setContactDeleted(true);
    } else {
      alert(
        "ERROR: Looks like something went wrong deleting this contact.\nPlease reload the page and try again."
      );
    }
  };

  const saveContact = async (reloadContact: boolean = true) => {
    setContactSpinner({ msg: "Saving Contact", on: true });
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/rt/contact-submit`,
      { data: formData },
      { withCredentials: true, validateStatus: (status) => status <= 500 }
    );
    setContactSpinner({ msg: "", on: false });
    if (res.status === 200) {
      // Update contact list entry to ensure last name is current
      if (isFiltered) {
        setFilteredContactList(
          filteredContactList.map((contact) =>
            contact.id === formData.contactRecord.id
              ? { ...contact, lastName: formData.contactRecord.last_name }
              : contact
          )
        );
      } else {
        setContactList(
          contactList.map((contact) =>
            contact.id === formData.contactRecord.id
              ? { ...contact, lastName: formData.contactRecord.last_name }
              : contact
          )
        );
      }
      if (reloadContact) {
        // Reload contact page from Redtail as a data validation measure
        selectContact(formData.contactRecord.id, true); // True means the contact was just saved
      }
    } else {
      alert(
        "ERROR: Looks like something went wrong updating this contact.\nPlease check form and try again."
      );
    }
  };

  const contactPrevLoad = () => {
    const contactIndex: number = isFiltered
      ? filteredContactList.findIndex(
          (contact) => contact.id === formData.contactRecord.id
        )
      : contactList.findIndex(
          (contact) => contact.id === formData.contactRecord.id
        );
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

  const contactNextLoad = () => {
    const contactIndex: number = isFiltered
      ? filteredContactList.findIndex(
          (contact) => contact.id === formData.contactRecord.id
        )
      : contactList.findIndex(
          (contact) => contact.id === formData.contactRecord.id
        );
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

  const handleContactPrevClick = async (e) => {
    e.preventDefault();
    if (props.isFormDirty && !isFormValid) {
      setIsContactInterceptProceedPrev(true);
      openContactInterceptModal();
    } else if (props.isFormDirty && isFormValid) {
      await saveContact(false); // false param prevents page reload after save
      contactPrevLoad();
    } else {
      contactPrevLoad();
    }
  };

  const handleContactNextClick = async (e) => {
    e.preventDefault();
    if (props.isFormDirty && !isFormValid) {
      setIsContactInterceptProceedPrev(false);
      openContactInterceptModal();
    } else if (props.isFormDirty && isFormValid) {
      await saveContact(false); // false param prevents page reload after save
      contactNextLoad();
    } else {
      contactNextLoad();
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
          handleContactChange={handleContactChange}
          contactList={contactList}
          filteredContactList={filteredContactList}
          setFilteredContactList={setFilteredContactList}
          isFiltered={isFiltered}
          setIsFiltered={setIsFiltered}
          clearFilter={clearFilter}
          setClearFilter={setClearFilter}
          setAppliedFilterData={setAppliedFilterData}
          filterPageData={filterPageData}
          setFilterPageData={setFilterPageData}
          isFilterDirty={isFilterDirty}
          pageData={pageData}
          changePage={changePage}
          pageInput={pageInput}
          pageInputText={pageInputText}
          setPageInputText={setPageInputText}
          dropdownData={dropdownData}
          setLoadingPage={setLoadingPage}
          selectContact={selectContact}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          filterData={filterData}
          setFilterData={setFilterData}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          selectedContactID={selectedContactID}
        ></ContactListPanel>
        <LoadingOverlay
          active={contactSpinner.on}
          spinner
          text={contactSpinner.msg}
        >
          <form
            className={styles.editPanel}
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <div className={styles.formRow}>
              <div className={styles.formColumn}>
                {isIndividual(formData) ? (
                  <>
                    <DropDownField
                      label="Salutation"
                      fieldName="salutation_id"
                      fieldValue={formData.contactRecord?.salutation_id}
                      dropDownItems={dropdownData.salutations}
                      handleChange={handleChange}
                    ></DropDownField>

                    <TextField
                      label="First Name"
                      fieldName="first_name"
                      fieldValue={formData.contactRecord?.first_name}
                      handleChange={handleChange}
                    ></TextField>
                    <TextField
                      label="Middle Name"
                      fieldName="middle_name"
                      fieldValue={formData.contactRecord?.middle_name}
                      handleChange={handleChange}
                    ></TextField>

                    <TextField
                      label="Last Name"
                      fieldName="last_name"
                      fieldValue={formData.contactRecord?.last_name}
                      handleChange={handleChange}
                    ></TextField>

                    <TextField
                      label="Nickname"
                      fieldName="nickname"
                      fieldValue={formData.contactRecord?.nickname}
                      handleChange={handleChange}
                    ></TextField>

                    <DropDownField
                      label="Gender"
                      fieldName="gender_id"
                      fieldValue={formData.contactRecord?.gender_id}
                      dropDownItems={dropdownData.genderTypes}
                      handleChange={handleChange}
                    ></DropDownField>
                  </>
                ) : (
                  <>
                    <TextField
                      label="Company Name"
                      fieldName="company_name"
                      fieldValue={formData.contactRecord?.company_name}
                      handleChange={handleChange}
                    ></TextField>
                  </>
                )}
              </div>

              <div className={styles.formColumn}>
                <DropDownField
                  label="Status"
                  fieldName="status_id"
                  fieldValue={formData.contactRecord?.status_id}
                  dropDownItems={dropdownData.status_id}
                  handleChange={handleChange}
                ></DropDownField>

                <DropDownField
                  label="Category"
                  fieldName="category_id"
                  fieldValue={formData.contactRecord?.category_id}
                  dropDownItems={dropdownData.category_id}
                  handleChange={handleChange}
                ></DropDownField>

                <DropDownField
                  label="Source"
                  fieldName="source_id"
                  fieldValue={formData.contactRecord?.source_id}
                  dropDownItems={dropdownData.source_id}
                  handleChange={handleChange}
                ></DropDownField>

                <TextField
                  label="Referred By"
                  fieldName="referred_by"
                  fieldValue={formData.contactRecord?.referred_by}
                  handleChange={handleChange}
                ></TextField>

                <DropDownField
                  label="Servicing Advisor"
                  fieldName="servicing_advisor_id"
                  fieldValue={formData.contactRecord?.servicing_advisor_id}
                  dropDownItems={dropdownData.servicingAdvisors}
                  handleChange={handleChange}
                ></DropDownField>

                <DropDownField
                  label="Writing Advisor"
                  fieldName="writing_advisor_id"
                  fieldValue={formData.contactRecord?.writing_advisor_id}
                  dropDownItems={dropdownData.writingAdvisors}
                  handleChange={handleChange}
                ></DropDownField>
              </div>

              <div className={styles.formColumn}>
                <TextField
                  label="Tax ID"
                  fieldName="tax_id"
                  fieldValue={formData.contactRecord?.tax_id}
                  handleChange={handleChange}
                ></TextField>

                <DateField
                  label="Client Since"
                  fieldName="client_since"
                  fieldValue={formData.contactRecord?.client_since}
                  handleDateChange={handleDateChange}
                ></DateField>

                {isIndividual(formData) ? (
                  <>
                    <DateField
                      label="Date of Birth"
                      fieldName="dob"
                      fieldValue={formData.contactRecord?.dob}
                      handleDateChange={handleDateChange}
                    ></DateField>

                    <DropDownField
                      label="Marital Status"
                      fieldName="marital_status_id"
                      fieldValue={formData.contactRecord?.marital_status_id}
                      dropDownItems={dropdownData.maritalTypes}
                      handleChange={handleChange}
                    ></DropDownField>

                    <TextField
                      label="Job Title"
                      fieldName="job_title"
                      fieldValue={formData.contactRecord?.job_title}
                      handleChange={handleChange}
                    ></TextField>
                  </>
                ) : null}
              </div>

              <div className={`${styles.formColumn} ${styles.buttonColumn}`}>
                <div className={styles.buttonRow}>
                  <button
                    className={styles.contactPrevButton}
                    onClick={handleContactPrevClick}
                    disabled={contactPrevDisabled}
                  />
                  <div className={styles.contactId}>
                    {formData.contactRecord.id}
                  </div>
                  <button
                    className={styles.contactNextButton}
                    onClick={handleContactNextClick}
                    disabled={contactNextDisabled}
                  />
                </div>
                <div
                  className={`${styles.timestamp} ${
                    isSaved ? styles.saved : ""
                  }`}
                >
                  {isSaved ? "Saved " : "Updated "}
                  {redtailDateToFormatedString(
                    formData.contactRecord.updated_at
                  )}
                </div>

                <div className={styles.saveButtonContainer}>
                  <button
                    type="submit"
                    className={`${styles.formButton} ${styles.saveContact}`}
                    disabled={!props.isFormDirty || !isFormValid}
                  >
                    SAVE
                  </button>
                  <div
                    className={`${styles.formRowEven} ${styles.thickMargin}`}
                  >
                    <button
                      className={`${styles.formButton} ${styles.undoContact}`}
                      onClick={handleUndo}
                      disabled={!props.isFormDirty}
                    >
                      UNDO
                    </button>
                    <button
                      className={`${styles.formButton} ${styles.deleteContact}`}
                      onClick={handleDelete}
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formRow}>
                <div className={styles.formColumn}>
                  <div className={styles.formRow}>
                    <div className={`${styles.floatingHeader} ${styles.short}`}>
                      <label
                        className={`${styles.floatingLabel} ${styles.short}`}
                      >
                        <h2 className={styles.h2}>Primary</h2>
                      </label>
                    </div>
                    <div className={`${styles.floatingHeader} ${styles.short}`}>
                      <label
                        className={`${styles.floatingLabel} ${styles.short}`}
                      >
                        <h2 className={styles.h2}>Title</h2>
                      </label>
                    </div>
                    <div className={`${styles.floatingHeader} ${styles.long}`}>
                      <label
                        className={`${styles.floatingLabel} ${styles.long}`}
                      >
                        <h2 className={styles.h2}>Phone Number</h2>
                      </label>
                    </div>
                    <div className={`${styles.floatingHeader} ${styles.short}`}>
                      <label
                        className={`${styles.floatingLabel} ${styles.short}`}
                      >
                        <h2 className={styles.h2}>Type</h2>
                      </label>
                    </div>
                    <div
                      className={`${styles.floatingHeader} ${styles.centered} ${styles.extraShort}`}
                    >
                      <img
                        src="/delete-icon.png"
                        className={styles.deleteIcon}
                      />
                    </div>
                  </div>
                  <PhoneFields
                    contact={formData}
                    handleArrChange={handleArrChange} // Used by Type and Primary inputs
                    handlePhoneChange={handlePhoneChange} // Used by Phone Number input
                    dropdownData={dropdownData}
                    removeContactField={removeContactField}
                  ></PhoneFields>
                  <div className={styles.formRowEven}>
                    <button
                      className={styles.addButton}
                      onClick={addContactField("phones")}
                    />
                  </div>
                </div>
                <div className={styles.formColumn}>
                  <div className={styles.formRow}>
                    <div className={`${styles.floatingHeader} ${styles.short}`}>
                      <label
                        className={`${styles.floatingLabel} ${styles.short}`}
                      >
                        <h2 className={styles.h2}>Primary</h2>
                      </label>
                    </div>
                    <div className={`${styles.floatingHeader} ${styles.short}`}>
                      <label
                        className={`${styles.floatingLabel} ${styles.short}`}
                      >
                        <h2 className={styles.h2}>Title</h2>
                      </label>
                    </div>
                    <div className={`${styles.floatingHeader} ${styles.long}`}>
                      <label
                        className={`${styles.floatingLabel} ${styles.long}`}
                      >
                        <h2 className={styles.h2}>Email Address</h2>
                      </label>
                    </div>
                    <div className={`${styles.floatingHeader} ${styles.short}`}>
                      <label
                        className={`${styles.floatingLabel} ${styles.short}`}
                      >
                        <h2 className={styles.h2}>Type</h2>
                      </label>
                    </div>
                    <div
                      className={`${styles.floatingHeader} ${styles.centered} ${styles.extraShort}`}
                    >
                      <img
                        src="/delete-icon.png"
                        className={styles.deleteIcon}
                      />
                    </div>
                  </div>
                  <EmailFields
                    contact={formData}
                    handleArrChange={handleArrChange}
                    dropdownData={dropdownData}
                    removeContactField={removeContactField}
                  ></EmailFields>
                  <div className={styles.formRowEven}>
                    <button
                      className={styles.addButton}
                      onClick={addContactField("emails")}
                    />
                  </div>
                </div>
                <div className={styles.formColumn}>
                  <div className={styles.formRow}>
                    <div className={`${styles.floatingHeader} ${styles.short}`}>
                      <label
                        className={`${styles.floatingLabel} ${styles.short}`}
                      >
                        <h2 className={styles.h2}>Title</h2>
                      </label>
                    </div>
                    <div className={`${styles.floatingHeader} ${styles.long}`}>
                      <label
                        className={`${styles.floatingLabel} ${styles.long}`}
                      >
                        <h2 className={styles.h2}>Website</h2>
                      </label>
                    </div>
                    <div className={`${styles.floatingHeader} ${styles.short}`}>
                      <label
                        className={`${styles.floatingLabel} ${styles.short}`}
                      >
                        <h2 className={styles.h2}>Type</h2>
                      </label>
                    </div>
                    <div
                      className={`${styles.floatingHeader} ${styles.centered} ${styles.extraShort}`}
                    >
                      <img
                        src="/delete-icon.png"
                        className={styles.deleteIcon}
                      />
                    </div>
                  </div>
                  <UrlFields
                    contact={formData}
                    handleArrChange={handleArrChange}
                    dropdownData={dropdownData}
                    removeContactField={removeContactField}
                  ></UrlFields>
                  <div className={styles.formRowEven}>
                    <button
                      className={styles.addButton}
                      onClick={addContactField("urls")}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formColumn}>
                <div className={styles.formRow}>
                  <div className={`${styles.floatingHeader} ${styles.short}`}>
                    <label
                      className={`${styles.floatingLabel} ${styles.short}`}
                    >
                      <h2 className={styles.h2}>Primary</h2>
                    </label>
                  </div>
                  <div className={`${styles.floatingHeader} ${styles.short}`}>
                    <label
                      className={`${styles.floatingLabel} ${styles.short}`}
                    >
                      <h2 className={styles.h2}>Title</h2>
                    </label>
                  </div>
                  <div
                    className={`${styles.floatingHeader} ${styles.extraLong}`}
                  >
                    <label
                      className={`${styles.floatingLabel} ${styles.extraLong}`}
                    >
                      <h2 className={styles.h2}>Street Address</h2>
                    </label>
                  </div>
                  <div
                    className={`${styles.floatingHeader} ${styles.extraLong}`}
                  >
                    <label
                      className={`${styles.floatingLabel} ${styles.extraLong}`}
                    >
                      <h2 className={styles.h2}>Secondary Address</h2>
                    </label>
                  </div>
                  <div className={`${styles.floatingHeader} ${styles.long}`}>
                    <label className={`${styles.floatingLabel} ${styles.long}`}>
                      <h2 className={styles.h2}>City</h2>
                    </label>
                  </div>
                  <div className={`${styles.floatingHeader} ${styles.short}`}>
                    <label
                      className={`${styles.floatingLabel} ${styles.short}`}
                    >
                      <h2 className={styles.h2}>State</h2>
                    </label>
                  </div>
                  <div className={`${styles.floatingHeader} ${styles.medium}`}>
                    <label
                      className={`${styles.floatingLabel} ${styles.medium}`}
                    >
                      <h2 className={styles.h2}>Zip</h2>
                    </label>
                  </div>
                  <div className={`${styles.floatingHeader} ${styles.short}`}>
                    <label
                      className={`${styles.floatingLabel} ${styles.short}`}
                    >
                      <h2 className={styles.h2}>Type</h2>
                    </label>
                  </div>
                  <div
                    className={`${styles.floatingHeader} ${styles.centered} ${styles.extraShort}`}
                  >
                    <img src="/delete-icon.png" className={styles.deleteIcon} />
                  </div>
                </div>
                <AddressFields
                  contact={formData}
                  handleArrChange={handleArrChange}
                  dropdownData={dropdownData}
                  removeContactField={removeContactField}
                ></AddressFields>
                <div className={styles.formRowEven}>
                  <button
                    className={styles.addButton}
                    onClick={addContactField("addresses")}
                  />
                </div>
              </div>
            </div>
          </form>
        </LoadingOverlay>
      </div>

      <ContactInterceptModal
        modalIsOpen={contactInterceptModalIsOpen}
        closeModal={closeContactInterceptModal}
        isContactInterceptProceedPrev={isContactInterceptProceedPrev}
        contactPrevLoad={contactPrevLoad}
        contactNextLoad={contactNextLoad}
      ></ContactInterceptModal>

      <DeleteContactModal
        modalIsOpen={deleteContactModalIsOpen}
        closeModal={closeDeleteContactModal}
        deleteContact={deleteContact}
      ></DeleteContactModal>
    </LoadingOverlay>
  );
}

DataCleanupPage.Layout = PageLayout;
