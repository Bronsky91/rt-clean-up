import { ContactFormData, ContactFieldsRec, RedtailContactRec, RedtailSettingsData } from "../interfaces/redtail.interface";
import { v4 as uuid } from "../node_modules/uuid";

export const createInitialContactRefData = (): Readonly<RedtailContactRec> =>
  Object.freeze({
    Address: null,
    ContactRecord: {
      Age: 0,
      AnniversaryDate: "",
      Category: "",
      CategoryID: 0,
      ClientID: 0,
      ClientSince: "",
      ClientSinceDate: "",
      ClientType: "",
      Company: "",
      CompanyID: 0,
      DatabaseID: 0,
      DateOfBirth: "",
      Deceased: "",
      Deleted: false,
      DeletedOn: "",
      Designation: "",
      Family: false,
      FamilyHeadID: 0,
      Familyname: "",
      Firstname: "",
      Gender: "",
      InputBy: null,
      InputByID: 0,
      InputDate: "",
      JobTitle: "",
      LastUpdate: "",
      Lastname: "",
      MaritalDate: "",
      MaritalStatus: "",
      Middlename: "",
      Name: "",
      Nickname: "",
      ReferredBy: "",
      Relationship: null,
      Salutation: "",
      ServicingAdvisor: "",
      ServicingAdvisorID: 0,
      Source: "",
      SourceID: 0,
      Status: "",
      StatusID: 0,
      Suffix: "",
      TaxID: "",
      WritingAdvisor: "",
      WritingAdvisorID: 0
    },
    Internet: null,
    Phone: null
  });

export const createInitalFormData = (): Readonly<ContactFormData> =>
  Object.freeze({
    key: uuid(),
    familyName: "",
    salutation: "",
    firstName: "",
    middleName: "",
    lastName: "",
    nickname: "",
    gender: "",
    categoryID: 0,
    statusID: 0,
    sourceID: 0,
    referredBy: "",
    servicingAdvisorID: 0,
    writingAdvisorID: 0,
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

export const createInitialDropDownData = (): Readonly<RedtailSettingsData> =>
  Object.freeze({
    statuses: [],
    categories: [],
    sources: [],
    salutations: [],
    servicingAdvisors: [],
    writingAdvisors: [],
  });
