import {
  RedtailContactUpdate,
  ContactRecordUpdate,
  AddressUpdate,
  EmailUpdate,
  PhoneUpdate,
  UrlUpdate,
} from "../interfaces/redtail-contact-update.interface";
import {
  RedtailContactRec,
  AddressRec,
  EmailRec,
  PhoneRec,
  UrlRec,
} from "../interfaces/redtail-contact.interface";
import { ContactFormData } from "../interfaces/redtail-form.interface";
import { toRedtailDatestring } from "./redtail-datestrings";

export const prepareContactSubmitData = (
  formData: ContactFormData,
  contactRec: RedtailContactRec
) => {
  const contactRecord: ContactRecordUpdate = {
    id: contactRec.id,
    salutation_id: formData.salutationID,
    first_name: formData.firstName,
    middle_name: formData.middleName,
    last_name: formData.lastName,
    nickname: formData.nickname,
    gender_id: formData.genderID,
    dob: formData.dateOfBirth,
    category_id: formData.categoryID,
    status_id: formData.statusID,
    source_id: formData.sourceID,
    tax_id: formData.taxID,
    servicing_advisor_id: formData.servicingAdvisorID,
    writing_advisor_id: formData.writingAdvisorID,
  };

  const addresses: AddressUpdate[] = formData.addresses.map((item) => {
    const fromSource: AddressRec | undefined = contactRec.addresses.find(
      (i) => i.id === item.ID
    );

    return {
      id: item.ID,
      street_address: item.streetAddress,
      secondary_address: item.secondaryAddress,
      city: item.city,
      state: item.state,
      zip: item.zip,
      country: fromSource.country,
      address_type: item.typeID,
      custom_type_title: fromSource.custom_type_title,
      description: fromSource.description,
      is_primary: item.primaryStreet,
      is_preferred: fromSource.is_preferred,
    };
  });

  const emails: EmailUpdate[] = formData.emails.map((item) => {
    const fromSource: EmailRec | undefined = contactRec.emails.find(
      (i) => i.id === item.ID
    );

    const updatedEmail: EmailUpdate = {
      id: item.ID,
      address: item.emailAddress,
      email_type: item.typeID,
      is_primary: item.primaryEmail,
    };
    return updatedEmail;
  });

  const phones: PhoneUpdate[] = formData.phones.map((item) => {
    const fromSource: PhoneRec | undefined = contactRec.phones.find(
      (i) => i.id === item.ID
    );
    const updatedPhone: PhoneUpdate = {
      id: item.ID,
      number: item.phoneNumber,
      phone_type: item.typeID,
      is_primary: item.primaryPhone,
    };

    return updatedPhone;
  });

  const urls: UrlUpdate[] = formData.urls.map((item) => {
    const fromSource: UrlRec | undefined = contactRec.urls.find(
      (i) => i.id === item.ID
    );
    const updatedUrl: UrlUpdate = {
      id: item.ID,
      address: item.address,
      url_type: item.typeID,
    };

    return updatedUrl;
  });

  const contactFieldsToDelete = formData.contactFieldsToDelete;

  const contactUpdate: RedtailContactUpdate = {
    ContactRecord: contactRecord,
    Addresses: addresses,
    Emails: emails,
    Phones: phones,
    Urls: urls,
    contactFieldsToDelete,
  };

  return {
    contactUpdate,
  };
};
