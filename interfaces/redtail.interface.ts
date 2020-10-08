// Used when SENDING data to Redtail
export interface RedtailContactUpdate {
  Fields: ContactFieldsUpdate;
  // TODO: update to include street addresses, email addresses, phone numbers
}

export interface ContactFieldsUpdate {
  AnniversaryDate: string;
  CategoryID: number;
  ClientID: number;
  ClientSinceDate: string;
  CompanyID: number;
  DateOfBirth: string;
  Designation: string;
  Family: boolean;
  FamilyHeadID: number;
  Familyname: string;
  Firstname: string;
  Gender: string;
  JobTitle: string;
  Lastname: string;
  MaritalStatus: string;
  Middlename: string;
  Name: string;
  Nickname: string;
  ReferredBy: string;
  Salutation: string;
  ServicingAdvisorID: number;
  SourceID: number;
  StatusID: number;
  Suffix: string;
  TaxID: string;
  TypeID: string;
  WritingAdvisorID: number;
}

// Used when RECEIVING data from Redtail
export interface RedtailContactRec {
  Address?: AddressRec[] | null;
  Fields: ContactFieldsRec;
  Internet?: InternetRec[] | null;
  Phone?: PhoneRec[] | null;
}

export interface AddressRec {
  Address1: string;
  Address2: string;
  City: string;
  ClientID: number;
  Label: string;
  LastUpdate: string;
  Preferred: boolean;
  Primary: boolean;
  RecAdd: string;
  RecAddUser: number;
  RecID: number;
  SharedAddress: boolean;
  State: string;
  Type: string;
  TypeID: string;
  Zip: string;
  Zip4?: null;
}
export interface ContactFieldsRec {
  Age: number;
  AnniversaryDate: string;
  Category: string;
  CategoryID: number;
  ClientID: number;
  ClientSince: string;
  ClientSinceDate: string;
  ClientType: string;
  Company: string;
  CompanyID: number;
  DatabaseID: number;
  DateOfBirth: string;
  Deceased: string;
  Deleted: boolean;
  DeletedOn: string;
  Designation: string;
  Family: boolean;
  FamilyHeadID: number;
  Familyname: string;
  Firstname: string;
  Gender: string;
  InputBy?: null;
  InputByID: number;
  InputDate: string;
  JobTitle: string;
  LastUpdate: string;
  Lastname: string;
  MaritalDate: string;
  MaritalStatus: string;
  Middlename: string;
  Name: string;
  Nickname: string;
  ReferredBy: string;
  Relationship?: null;
  Salutation: string;
  ServicingAdvisor: string;
  ServicingAdvisorID: number;
  Source: string;
  SourceID: number;
  Status: string;
  StatusID: number;
  Suffix: string;
  TaxID: string;
  WritingAdvisor: string;
  WritingAdvisorID: number;
}

export interface InternetRec {
  Address: string;
  ClientID: number;
  Label: string;
  LastUpdate: string;
  Preferred: boolean;
  Primary: boolean;
  Priority: boolean;
  RecAdd: string;
  RecAddUser: number;
  RecID: number;
  Type: string;
  TypeID: number;
}
export interface PhoneRec {
  ClientID: number;
  DisplayOrder: number;
  Extension: string;
  Label: string;
  LastUpdate: string;
  Number: string;
  Number_Formatted: string;
  Preferred: boolean;
  Primary: boolean;
  RecAdd: string;
  RecAddUser: number;
  RecID: number;
  SharedPhoneNumber: boolean;
  SpeedDial: string;
  Type: string;
  TypeID: string;
}

export interface RedtailStatus {
  CSLCode: number;
  Code: string;
  DatabaseID: number;
  Deleted: boolean;
  LastUpdate: number;
}

export interface RedtailCategory {
  Code: string;
  DatabaseID: number;
  Deleted: boolean;
  MCCLCode: number;
}

export interface RedtailSource {
  Code: string;
  DatabaseID: number;
  Deleted: boolean;
  MCSLCode: number;
}

export interface RedtailSalutation {
  Code: string;
  Deleted: boolean;
  RecAdd: string;
  RecAddUser: number;
  SalutationCode: number;
}
export interface RedtailServicingAdvisor {
  Code: string;
  DatabaseID: number;
  Deleted: boolean;
  SALCode: number;
}

export interface RedtailWritingAdvisor {
  Code: string;
  DatabaseID: number;
  Deleted: boolean;
  WALCode: number;
}

export interface RedtailSettingsData {
  statuses: RedtailStatus[];
  categories: RedtailCategory[];
  sources: RedtailSource[];
  salutations: RedtailSalutation[];
  servicingAdvisors: RedtailServicingAdvisor[];
  writingAdvisors: RedtailWritingAdvisor[];
}

export interface ContactFormData {
  key: string;
  familyName: string;
  salutation: string;
  firstName: string;
  middleName: string;
  lastName: string;
  nickname: string;
  gender: string;
  categoryID: number;
  statusID: number;
  sourceID: number;
  referredBy: string;
  servicingAdvisorID: number;
  writingAdvisorID: number;
  phoneNumbers: PhoneNumberFormData[];
  emailAddresses: EmailAddressFormData[];
  streetAddresses: StreetAddressFormData[];
}

export interface PhoneNumberFormData {
  key: string;
  phoneNumber: string;
  type: string;
  primary: boolean;
}

export interface EmailAddressFormData {
  key: string;
  emailAddress: string;
  type: string;
  primary: boolean;
}

export interface StreetAddressFormData {
  key: string;
  streetAddress: string;
  secondaryAddress: string;
  city: string;
  state: string;
  zip: string;
  type: string;
  primary: boolean;
}
