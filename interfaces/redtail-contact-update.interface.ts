// Used when SENDING data to Redtail
export interface RedtailContactUpdate {
  ContactRecord: ContactRecordUpdate;
  Addresses?: AddressUpdate[] | null;
  Emails?: EmailUpdate[] | null;
  Phones?: PhoneUpdate[] | null;
  Urls?: UrlUpdate[] | null;
  contactFieldsToDelete: {
    addresses?: number[];
    emails?: number[];
    phones?: number[];
    urls?: number[];
  };
}

export interface ContactRecordUpdate {
  id: number;
  salutation_id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  nickname: string;
  gender_id: number;
  dob: string;
  category_id: number;
  status_id: number;
  source_id: number;
  tax_id: string | null;
  servicing_advisor_id: number;
  writing_advisor_id: number;
}

export interface AddressUpdate {
  id: number;
  street_address: string;
  secondary_address: string;
  city: string;
  state: string;
  zip: string;
  address_type: number;
  is_primary: boolean;
}

export interface EmailUpdate {
  id: number;
  address: string;
  email_type: number;
  is_primary: boolean;
}

export interface PhoneUpdate {
  id: number;
  number: string;
  phone_type: number;
  is_primary: boolean;
}

export interface UrlUpdate {
  id: number;
  address: string;
  url_type: number;
}
