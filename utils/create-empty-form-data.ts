import { v4 as uuid } from "uuid";
import { Z_FIXED } from "zlib";
import { FilterData } from "../interfaces/redtail-contact-list.interface";
import { RedtailContactRec } from "../interfaces/redtail-contact.interface";
import { ContactFormData } from "../interfaces/redtail-form.interface";
import { RedtailSettingsData } from "../interfaces/redtail-settings.interface";

export const createEmptyContactRefData = (): Readonly<RedtailContactRec> =>
  Object.freeze({
    id: 0,
    type: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    company_name: null,
    full_name: "",
    nickname: "",
    suffix_id: null,
    suffix: null,
    job_title: "",
    favorite: false,
    deleted: false,
    created_at: "",
    updated_at: "",
    salutation_id: 0,
    salutation: "",
    source_id: 0,
    source: "",
    status_id: 0,
    status: "",
    category_id: 0,
    category: "",
    gender_id: 0,
    gender: "",
    spouse_name: null,
    tax_id: null,
    dob: "",
    death_date: null,
    client_since: null,
    client_termination_date: null,
    marital_status_id: 0,
    marital_status: "",
    marital_date: null,
    employer_id: 0,
    employer: null,
    designation: "",
    referred_by: null,
    servicing_advisor_id: 0,
    servicing_advisor: "",
    writing_advisor_id: 0,
    writing_advisor: "",
    added_by: 0,
    addresses: null,
    phones: null,
    emails: null,
    urls: null,
  });

export const createEmptyFormData = (): Readonly<ContactFormData> =>
  Object.freeze({
    key: uuid(),
    salutationID: 0,
    firstName: "",
    middleName: "",
    lastName: "",
    nickname: "",
    dateOfBirth: "",
    genderID: 0,
    categoryID: 0,
    statusID: 0,
    sourceID: 0,
    taxID: "",
    servicingAdvisorID: 0,
    writingAdvisorID: 0,
    phones: [createEmptyContactField["phones"]()],
    emails: [createEmptyContactField["emails"]()],
    addresses: [createEmptyContactField["addresses"]()],
    urls: [createEmptyContactField["urls"]()],
    contactFieldsToDelete: {
      emails: [],
      addresses: [],
      phones: [],
      urls: [],
    },
  });

export const createEmptyDropDownData = (): Readonly<RedtailSettingsData> =>
  Object.freeze({
    status_id: [],
    category_id: [],
    source_id: [],
    salutations: [],
    servicingAdvisors: [],
    writingAdvisors: [],
    genderTypes: [],
    addressTypes: [],
    emailTypes: [],
    phoneTypes: [],
    urlTypes: [],
  });

export const createEmptyContactField = {
  addresses: () => ({
    key: uuid(),
    id: 0,
    streetAddress: "",
    secondaryAddress: "",
    city: "",
    state: "",
    zip: "",
    typeID: 1,
    primaryStreet: false,
  }),
  emails: () => ({
    key: uuid(),
    id: 0,
    emailAddress: "",
    typeID: 1,
    primaryEmail: false,
  }),
  phones: () => ({
    key: uuid(),
    id: 0,
    phoneNumber: "",
    typeID: 1,
    primaryPhone: false,
  }),
  urls: () => ({
    key: uuid(),
    id: 0,
    address: "",
    typeID: 1,
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
