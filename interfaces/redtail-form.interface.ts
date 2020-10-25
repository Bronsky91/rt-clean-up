export interface ContactFormData {
  key: string;
  salutation: string;
  firstName: string;
  middleName: string;
  lastName: string;
  nickname: string;
  dateOfBirth: string;
  gender: string;
  categoryID: number;
  statusID: number;
  sourceID: number;
  taxID: string;
  servicingAdvisorID: number;
  writingAdvisorID: number;
  phoneNumbers: PhoneNumberFormData[];
  emailAddresses: EmailAddressFormData[];
  streetAddresses: StreetAddressFormData[];
  contactFieldsToDelete: {
    emailAddresses: number[];
    streetAddresses: number[];
    phoneNumbers: number[];
  };
}

export interface PhoneNumberFormData {
  recID: number;
  key: string;
  phoneNumber: string;
  typeID: string;
  primaryPhone: boolean;
}

export interface EmailAddressFormData {
  recID: number;
  key: string;
  emailAddress: string;
  typeID: number;
  primaryEmail: boolean;
}

export interface StreetAddressFormData {
  recID: number;
  key: string;
  streetAddress: string;
  secondaryAddress: string;
  city: string;
  state: string;
  zip: string;
  typeID: string;
  primaryStreet: boolean;
}

export interface StateAbbr {
  short: string;
  long: string;
}
