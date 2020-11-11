import Axios from "axios";
import { v4 as uuid } from "uuid";
import {
  AddressRec,
  EmailRec,
  PhoneRec,
  RedtailContactRec,
  UrlRec,
} from "../interfaces/redtail-contact-receive.interface";
import { RedtailContactUpdate } from "../interfaces/redtail-contact-update.interface";

export const getContactAndPopulateForm = (
  setOriginalFormData,
  setFormData,
  formData,
  id
) => {
  return Axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/rt/get-contact`,
    { id },
    { withCredentials: true }
  ).then((res) => {
    const data: RedtailContactRec = res.data.contact;

    const loadedFormData: RedtailContactUpdate = {
      key: formData.key,
      contactRecord: {
        id: data.id || 0,
        type: data.type || "",
        salutation_id: data.salutation_id || 0,
        first_name: data.first_name || "",
        middle_name: data.middle_name || "",
        last_name: data.last_name || "",
        nickname: data.nickname || "",
        company_name: data.company_name || "",
        gender_id: data.gender_id || 0,
        dob: data.dob || "",
        category_id: data.category_id || 0,
        status_id: data.status_id || 0,
        source_id: data.source_id || 0,
        tax_id: data.tax_id || "",
        referred_by: data.referred_by || "",
        servicing_advisor_id: data.servicing_advisor_id || 0,
        writing_advisor_id: data.writing_advisor_id || 0,
      },
      addresses: data.addresses
        ? data.addresses.map((obj: AddressRec) => ({
            key: uuid(),
            id: obj.id ? obj.id : 0,
            street_address: obj.street_address || "",
            secondary_address: obj.secondary_address || "",
            city: obj.city || "",
            state: obj.state || "",
            zip: obj.zip || "",
            address_type: obj.address_type || 0,
            is_primary: obj.is_primary || false,
          }))
        : null,
      emails: data.emails
        ? data.emails.map((obj: EmailRec) => ({
            key: uuid(),
            id: obj.id || 0,
            address: obj.address || "",
            email_type: obj.email_type || 0,
            is_primary: obj.is_primary || false,
          }))
        : null,
      phones: data.phones
        ? data.phones.map((obj: PhoneRec) => ({
            key: uuid(),
            id: obj.id || 0,
            country_code: obj.country_code || 1,
            number:
              obj.country_code && obj.number
                ? obj.country_code.toString() + obj.number // add country_code to number for react-phone-input-2
                : "",
            phone_type: obj.phone_type || 0,
            is_primary: obj.is_primary || false,
          }))
        : null,
      urls: data.urls
        ? data.urls.map((obj: UrlRec) => ({
            key: uuid(),
            id: obj.id || 0,
            address: obj.address || "",
            url_type: obj.url_type || 0,
          }))
        : null,
      contactFieldsToDelete: {
        emails: [],
        addresses: [],
        phones: [],
        urls: [],
      },
    };

    setFormData(loadedFormData);
    setOriginalFormData(JSON.parse(JSON.stringify(loadedFormData))); // force pass by val not ref
  });
};
