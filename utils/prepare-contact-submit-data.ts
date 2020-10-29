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
    type: contactRec.type,
    source_id: formData.sourceID,
    status_id: formData.statusID,
    category_id: formData.categoryID,
    first_name: formData.firstName,
    middle_name: formData.middleName,
    last_name: formData.lastName,
    tax_id: formData.taxID,
    dob: formData.dateOfBirth,
    /*
    AnniversaryDate: contact.an
    CategoryID: formData.categoryID,
    ClientID: contact.ContactRecord.ClientID,
    ClientSinceDate: contact.ContactRecord.ClientSinceDate,
    CompanyID: contact.ContactRecord.CompanyID,
    DateOfBirth: toRedtailDatestring(formData.dateOfBirth),
    Designation: contact.ContactRecord.Designation,
    Family: contact.ContactRecord.Family,
    FamilyHeadID: contact.ContactRecord.FamilyHeadID,
    Familyname: contact.ContactRecord.Familyname,
    Firstname: formData.firstName,
    Gender: formData.gender,
    JobTitle: contact.ContactRecord.JobTitle,
    Lastname: formData.lastName,
    MaritalStatus: contact.ContactRecord.MaritalStatus,
    Middlename: formData.middleName,
    Name: contact.ContactRecord.Name,
    Nickname: formData.nickname,
    ReferredBy: contact.ContactRecord.ReferredBy,
    Salutation: formData.salutation,
    ServicingAdvisorID: formData.servicingAdvisorID,
    SourceID: formData.sourceID,
    StatusID: formData.statusID,
    Suffix: contact.ContactRecord.Suffix,
    TaxID: formData.taxID,
    TypeID: contact.ContactRecord.ClientType,
    WritingAdvisorID: formData.writingAdvisorID,
    */
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
      emailable_id: fromSource ? fromSource.emailable_id : 0,
      address: item.emailAddress,
      email_type: item.typeID,
      custom_type_title: fromSource.custom_type_title,
      description: fromSource.description,
      is_primary: item.primaryEmail,
      is_preferred: fromSource.is_preferred,
    };
    return updatedEmail;
  });

  const phones: PhoneUpdate[] = formData.phones.map((item) => {
    const fromSource: PhoneRec | undefined = contactRec.phones.find(
      (i) => i.id === item.ID
    );
    const updatedPhone: PhoneUpdate = {
      id: item.ID,
      country_code: fromSource.country_code,
      number: item.phoneNumber,
      extension: fromSource.extension,
      phone_type: item.typeID,
      speed_dial: fromSource.speed_dial,
      is_preferred: fromSource.is_preferred,
      is_primary: item.primaryPhone,
      custom_type_title: fromSource.custom_type_title,
      description: fromSource.description,
    };

    return updatedPhone;
  });

  const urls: UrlUpdate[] = formData.urls.map((item) => {
    const fromSource: UrlRec | undefined = contactRec.urls.find(
      (i) => i.id === item.ID
    );
    const updatedUrl: UrlUpdate = {
      id: item.ID,
      address: item.website,
      url_type: item.typeID,
      custom_type_title: fromSource.custom_type_title,
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
