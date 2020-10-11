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
  PhoneRec,
  InternetRec,
  AddressRec,
  PhoneNumberFormData,
  EmailAddressFormData,
  StreetAddressFormData,
} from "../interfaces/redtail.interface";
import { API_URL } from "../constants";
import { useRouter } from "next/router";
import Login from "./login";
import { getContactAndPopulateForm } from "../utils/get-contact-and-populate-form";
import { applyLocalStorage } from "../utils/apply-local-storage";
import { prepareContactSubmitData } from "../utils/prepare-contact-submit-data";
import { canUndo } from "../utils/can-undo";
import { undoContactChanges } from "../utils/undo-contact-changes";
import ContactListPanel from "../components/contact-list-panel";
import {
  createInitialContactRefData,
  createInitalFormData,
  createInitialDropDownData,
} from "../utils/create-initial-form-data";
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
        updateFormData,
        updateSourceContactRef
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

  const initialSourceContactRef: Readonly<RedtailContactRec> = createInitialContactRefData();
  const initialFormData: Readonly<ContactFormData> = createInitalFormData();
  const redtailDropDowns: Readonly<RedtailSettingsData> = createInitialDropDownData();

  const [sourceContactRef, updateSourceContactRef] = useState(
    initialSourceContactRef
  );
  const [formData, updateFormData] = useState(initialFormData);
  const [selectedContact, updateSelectedContact] = useState({
    id: "",
    page: 1,
  });
  const [contactList, setContactList] = useState([]);
  const [dropdownData, updateDropdownData] = useState(redtailDropDowns);
  const [pageData, updatePageData] = useState({
    current_page: 1,
    total_pages: 1,
  });
  const [loadingPage, setLoadingPage] = useState(false);
  const [loadingContact, setLoadingContact] = useState(false);
  const [savingContact, setSavingContact] = useState(false);
  const [undoEnabled, setUndoEnabled] = useState(false);

  // Saves Form State to Local Storage after each change
  useEffect(() => {
    localStorage.setItem("dataCleanUpFormData", JSON.stringify(formData));
    localStorage.setItem(
      "dataCleanUpSelectedContactData",
      JSON.stringify(selectedContact)
    );
    localStorage.setItem(
      "dataCleanUpSourceContactRef",
      JSON.stringify(sourceContactRef)
    );
  }, [formData, selectedContact, sourceContactRef]);

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

    updateFormData({
      ...formData,
      [arrName]: newArr,
    });
    setUndoEnabled(canUndo(sourceContactRef, formData));
  };

  const handleChange = (e) => {
    e.preventDefault();
    const target = e.target;
    updateFormData({
      ...formData,
      // Trimming any whitespace
      [target.name]: target.value.trim(),
    });
    setUndoEnabled(canUndo(sourceContactRef, formData));
  };

  const contactSelected = (e) => {
    e.preventDefault();
    setLoadingContact(true);

    const id = e.target.value;
    updateSelectedContact({ id, page: 1 });
    getContactAndPopulateForm(
      updateSourceContactRef,
      updateFormData,
      formData,
      id
    ).then(() => {
      setLoadingContact(false);
    });
  };

  const undoContact = (e) => {
    e.preventDefault();
    setLoadingContact(true);
    undoContactChanges(sourceContactRef, updateFormData, formData);
    setLoadingContact(false);
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
            "Error submitting contact!: HTTP " +
              res.status.toString() +
              " status " +
              res.statusText
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
                </div>

                <div className={styles.formColumn}>
                  <div className={styles.formRow}>
                    <div className={styles.formColumn}>
                      <div className={styles.formField}>
                        <label className={styles.formLabel}>Category</label>
                        <select
                          className={styles.formLabelledInput}
                          onChange={handleChange}
                          name="categoryID"
                          value={formData.categoryID}
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
                          name="statusID"
                          value={formData.statusID}
                        >
                          <option value=""></option>
                          {dropdownData.statuses.map((obj, index) => (
                            <option key={index} value={obj.CSLCode || ""}>
                              {obj.Code || ""}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className={styles.formField}>
                        <label className={styles.formLabel}>Source</label>
                        <select
                          className={styles.formLabelledInput}
                          onChange={handleChange}
                          name="sourceID"
                          value={formData.sourceID}
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
                          name="servicingAdvisorID"
                          value={formData.servicingAdvisorID}
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
                        <label className={styles.formLabel}>
                          Writing Advisor
                        </label>
                        <select
                          className={styles.formLabelledInput}
                          onChange={handleChange}
                          name="writingAdvisorID"
                          value={formData.writingAdvisorID}
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
                    {/* Place holder fields for DOB and Tax ID at last */}
                    <div className={styles.formColumn}>
                      <div className={styles.formField}>
                        <label className={styles.formLabel}>PlaceHolder</label>
                        <select
                          className={styles.formLabelledInput}
                          onChange={handleChange}
                        >
                          <option value=""></option>
                        </select>
                      </div>
                      <div className={styles.formField}>
                        <label className={styles.formLabel}>PlaceHolder</label>
                        <select className={styles.formLabelledInput}></select>
                      </div>
                    </div>
                    {/* -------- */}
                    <div className={styles.formColumn}>
                      <button type="submit" className={styles.saveButton}>
                        SAVE
                      </button>
                      <button
                        className={styles.undoButton}
                        onClick={undoContact}
                        disabled={!undoEnabled}
                      >
                        UNDO
                      </button>
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
                    <div className={styles.formColumnScroll}>
                      {formData.emailAddresses.map((obj, index) => (
                        <div className={styles.formRow} key={obj.key}>
                          <input
                            className={styles.formSoloInput}
                            type="text"
                            name="emailAddress"
                            value={obj.emailAddress || ""}
                            onChange={handleArrChange(
                              index,
                              "emailAddresses",
                              obj.recID
                            )}
                          />
                          <input
                            className={styles.formSoloInput}
                            type="text"
                            name="type"
                            value={obj.type || ""}
                            onChange={handleArrChange(
                              index,
                              "emailAddresses",
                              obj.recID
                            )}
                          />
                          <input
                            type="radio"
                            name="primaryEmail"
                            checked={obj.primaryEmail}
                            onChange={handleArrChange(
                              index,
                              "emailAddresses",
                              obj.recID
                            )}
                          />
                        </div>
                      ))}
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
                            name="phoneNumber"
                            value={obj.phoneNumber || ""}
                            onChange={handleArrChange(
                              index,
                              "phoneNumbers",
                              obj.recID
                            )}
                          />
                          <input
                            className={styles.formSoloInput}
                            type="text"
                            name="type"
                            value={obj.type || ""}
                            onChange={handleArrChange(
                              index,
                              "phoneNumbers",
                              obj.recID
                            )}
                          />
                          <input
                            type="radio"
                            name="primaryPhone"
                            value=""
                            checked={obj.primaryPhone}
                            onChange={handleArrChange(
                              index,
                              "phoneNumbers",
                              obj.recID
                            )}
                          />
                        </div>
                      ))}
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
                  <div className={styles.formColumnScroll}>
                    {formData.streetAddresses.map((obj, index) => (
                      <div className={styles.formRow} key={obj.key}>
                        <input
                          className={styles.formSoloInput}
                          type="text"
                          name="streetAddress"
                          value={obj.streetAddress || ""}
                          onChange={handleArrChange(
                            index,
                            "streetAddresses",
                            obj.recID
                          )}
                        />
                        <input
                          className={styles.formSoloInput}
                          type="text"
                          name="secondaryAddress"
                          value={obj.secondaryAddress || ""}
                          onChange={handleArrChange(
                            index,
                            "streetAddresses",
                            obj.recID
                          )}
                        />
                        <input
                          className={styles.formSoloInput}
                          type="text"
                          name="city"
                          value={obj.city || ""}
                          onChange={handleArrChange(
                            index,
                            "streetAddresses",
                            obj.recID
                          )}
                        />
                        <input
                          className={styles.formSoloInput}
                          type="text"
                          name="state"
                          value={obj.state || ""}
                          onChange={handleArrChange(
                            index,
                            "streetAddresses",
                            obj.recID
                          )}
                        />
                        <input
                          className={styles.formSoloInput}
                          type="text"
                          name="zip"
                          value={obj.zip || ""}
                          onChange={handleArrChange(
                            index,
                            "streetAddresses",
                            obj.recID
                          )}
                        />
                        <input
                          className={styles.formSoloInput}
                          type="text"
                          value={obj.type || ""}
                          onChange={handleArrChange(
                            index,
                            "streetAddresses",
                            obj.recID
                          )}
                        />
                        <input
                          type="radio"
                          name="primaryStreet"
                          value=""
                          checked={obj.primaryStreet}
                          onChange={handleArrChange(
                            index,
                            "streetAddresses",
                            obj.recID
                          )}
                        />
                      </div>
                    ))}
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
