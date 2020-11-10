import { v4 as uuid } from "uuid";
import { FilterData } from "../interfaces/redtail-contact-list.interface";
import { RedtailContactRec } from "../interfaces/redtail-contact-receive.interface";
import {
  AddressUpdate,
  ContactRecordUpdate,
  EmailUpdate,
  PhoneUpdate,
  RedtailContactUpdate,
  UrlUpdate,
} from "../interfaces/redtail-contact-update.interface";
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

export const createEmptyFormData = (): Readonly<RedtailContactUpdate> =>
  Object.freeze({
    key: uuid(),
    contactRecord: createEmptyContactField["contactRecord"](),
    addresses: [createEmptyContactField["addresses"]()],
    emails: [createEmptyContactField["emails"]()],
    phones: [createEmptyContactField["phones"]()],
    urls: [createEmptyContactField["urls"]()],
    contactFieldsToDelete: {
      emails: [],
      addresses: [],
      phones: [],
      urls: [],
    },
  });

export const createEmptyContactField = {
  contactRecord: (): ContactRecordUpdate => ({
    id: 0,
    salutation_id: 0,
    first_name: "",
    middle_name: "",
    last_name: "",
    nickname: "",
    gender_id: 0,
    dob: "",
    category_id: 0,
    status_id: 0,
    source_id: 0,
    tax_id: "",
    servicing_advisor_id: 0,
    writing_advisor_id: 0,
  }),
  addresses: (): AddressUpdate => ({
    key: uuid(),
    id: 0,
    street_address: "",
    secondary_address: "",
    city: "",
    state: "",
    zip: "",
    address_type: 1,
    is_primary: false,
  }),
  emails: (): EmailUpdate => ({
    key: uuid(),
    id: 0,
    address: "",
    email_type: 1,
    is_primary: false,
  }),
  phones: (): PhoneUpdate => ({
    key: uuid(),
    id: 0,
    country_code: null,
    number: "",
    phone_type: 1,
    is_primary: false,
  }),
  urls: (): UrlUpdate => ({
    key: uuid(),
    id: 0,
    address: "",
    url_type: 1,
  }),
};

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
