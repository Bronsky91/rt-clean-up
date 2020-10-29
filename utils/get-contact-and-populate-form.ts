import Axios from "axios";
import { v4 as uuid } from "uuid";
import { fromRedtailDatestring } from "./redtail-datestrings";
import {
  AddressRec,
  EmailRec,
  PhoneRec,
  RedtailContactRec,
  UrlRec,
} from "../interfaces/redtail-contact.interface";
import { ContactFormData } from "../interfaces/redtail-form.interface";

export const getContactAndPopulateForm = (
  updateSourceContactRef,
  updateFormData,
  updateOriginalFormData,
  updateFormDirty,
  formData,
  id
) => {
  return Axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/rt/get-contact`,
    { id },
    { withCredentials: true }
  ).then((res) => {
    const data: RedtailContactRec = res.data;
    updateSourceContactRef(data);

    const loadedFormData: ContactFormData = {
      key: formData.key,
      salutationID: data.salutation_id,
      firstName: data.first_name,
      middleName: data.middle_name,
      lastName: data.last_name,
      nickname: data.nickname,
      dateOfBirth: data.dob, //fromRedtailDatestring(data.ContactRecord.DateOfBirth),
      genderID: data.gender_id,
      categoryID: data.category_id,
      statusID: data.status_id,
      sourceID: data.source_id,
      taxID: data.tax_id,
      servicingAdvisorID: data.servicing_advisor_id,
      writingAdvisorID: data.writing_advisor_id,
      phones: data.phones.map((obj: PhoneRec) => ({
        key: uuid(),
        ID: obj.id,
        phoneNumber: obj.number,
        typeID: obj.phone_type,
        primaryPhone: obj.is_primary,
      })),
      emails: data.emails.map((obj: EmailRec) => ({
        key: uuid(),
        ID: obj.id,
        emailAddress: obj.address,
        typeID: obj.email_type,
        primaryEmail: obj.is_primary,
      })),
      addresses: data.addresses.map((obj: AddressRec) => ({
        key: uuid(),
        ID: obj.id,
        streetAddress: obj.street_address,
        secondaryAddress: obj.secondary_address,
        city: obj.city,
        state: obj.state,
        zip: obj.zip,
        typeID: obj.address_type,
        primaryStreet: obj.is_primary,
      })),
      urls: data.urls.map((obj: UrlRec) => ({
        key: uuid(),
        ID: obj.id,
        website: obj.address,
        typeID: obj.url_type,
      })),
      contactFieldsToDelete: {
        addresses: [],
        emails: [],
        phones: [],
        urls: [],
      },
    };

    updateFormData(loadedFormData);
    updateOriginalFormData(JSON.parse(JSON.stringify(loadedFormData))); // force pass by val not ref
    updateFormDirty(false);
  });
};
