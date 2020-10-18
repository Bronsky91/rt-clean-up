import { v4 as uuid } from "uuid";
import { FilterData } from "../interfaces/redtail-contact-list.interface";
import { RedtailContactMasterRec } from "../interfaces/redtail-contact.interface";
import { ContactFormData } from "../interfaces/redtail-form.interface";
import { RedtailSettingsData } from "../interfaces/redtail-settings.interface";

export const createEmptyContactRefData = (): Readonly<
  RedtailContactMasterRec
> =>
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
      WritingAdvisorID: 0,
    },
    Internet: null,
    Phone: null,
  });

export const createEmptyFormData = (): Readonly<ContactFormData> =>
  Object.freeze({
    key: uuid(),
    salutation: "",
    firstName: "",
    middleName: "",
    lastName: "",
    nickname: "",
    dateOfBirth: null,
    gender: "",
    categoryID: 0,
    statusID: 0,
    sourceID: 0,
    taxID: "",
    servicingAdvisorID: 0,
    writingAdvisorID: 0,
    phoneNumbers: [createEmptyContactField["phoneNumbers"]()],
    emailAddresses: [createEmptyContactField["emailAddresses"]()],
    streetAddresses: [createEmptyContactField["streetAddresses"](), ,],
  });

export const createEmptyDropDownData = (): Readonly<RedtailSettingsData> =>
  Object.freeze({
    status_id: [],
    category_id: [],
    source_id: [],
    salutations: [],
    servicingAdvisors: [],
    writingAdvisors: [],
    gender: [],
    addressTypes: [],
    internetTypes: [],
    phoneTypes: [],
  });

export const createEmptyContactField = {
  emailAddresses: () => ({
    key: uuid(),
    recID: 0,
    emailAddress: "",
    typeID: 1,
    primaryEmail: false,
  }),
  streetAddresses: () => ({
    key: uuid(),
    recID: 0,
    streetAddress: "",
    secondaryAddress: "",
    city: "",
    state: "",
    zip: "",
    typeID: "H",
    primaryStreet: false,
  }),
  phoneNumbers: () => ({
    key: uuid(),
    recID: 0,
    phoneNumber: "",
    typeID: "HM",
    primaryPhone: false,
  }),
};

export const createEmptyFilterData = (): Readonly<FilterData[]> =>
  Array.from([
    {
      filter: "status_id",
      selectedIds: [],
    },
    {
      filter: "source_id",
      selectedIds: [],
    },
    {
      filter: "category_id",
      selectedIds: [],
    },
    // {
    //   filter: "servicingAdvisors",
    //   selectedIds: [],
    // },
    // {
    //   filter: "writingAdvisors",
    //   selectedIds: [],
    // },
  ]);
