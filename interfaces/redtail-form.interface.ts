export interface ContactFormData {
  key: string;
  salutationID: number;
  firstName: string;
  middleName: string;
  lastName: string;
  nickname: string;
  dateOfBirth: string;
  genderID: number;
  categoryID: number;
  statusID: number;
  sourceID: number;
  taxID: string;
  servicingAdvisorID: number;
  writingAdvisorID: number;
  phones: PhoneFormData[];
  emails: EmailFormData[];
  addresses: AddressFormData[];
  urls: UrlFormData[];
  contactFieldsToDelete: {
    emails: number[];
    addresses: number[];
    phones: number[];
    urls: number[];
  };
}

export interface PhoneFormData {
  ID: number;
  key: string;
  phoneNumber: string;
  typeID: number;
  primaryPhone: boolean;
}

export interface EmailFormData {
  ID: number;
  key: string;
  emailAddress: string;
  typeID: number;
  primaryEmail: boolean;
}

export interface AddressFormData {
  ID: number;
  key: string;
  streetAddress: string;
  secondaryAddress: string;
  city: string;
  state: string;
  zip: string;
  typeID: number;
  primaryStreet: boolean;
}

export interface UrlFormData {
  ID: number;
  key: string;
  address: string;
  typeID: number;
}

export interface StateAbbr {
  short: string;
  long: string;
}
