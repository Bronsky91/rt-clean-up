import {
  RedtailContactRec,
  RedtailContactUpdate,
  AddressUpdate,
  InternetUpdate,
  PhoneUpdate,
  ContactFieldsUpdate,
  ContactFormData,
  StreetAddressFormData,
  EmailAddressFormData,
  PhoneNumberFormData,
} from "../interfaces/redtail.interface";

export const prepareContactSubmitData = (
  formData: ContactFormData,
  fields: RedtailContactRec
) => {
  const address: AddressUpdate[] = fields.Address
    ? fields.Address.map((item) => {
        const fromForm:
          | StreetAddressFormData
          | undefined = formData.streetAddresses.find(
          (i) => i.recID === item.RecID
        );

        return {
          Address1: fromForm ? fromForm.streetAddress : item.Address1,
          Address2: fromForm ? fromForm.secondaryAddress : item.Address2,
          City: fromForm ? fromForm.city : item.City,
          ClientID: item.ClientID,
          Label: item.Label,
          Preferred: item.Preferred,
          Primary: fromForm ? fromForm.primaryStreet : item.Primary,
          RecID: item.RecID,
          SharedAddress: item.SharedAddress,
          State: fromForm ? fromForm.state : item.State,
          TypeID: fromForm ? fromForm.type : item.TypeID,
          Zip: fromForm ? fromForm.zip : item.Zip,
        };
      })
    : null;

  const contactRecord: ContactFieldsUpdate = {
    AnniversaryDate: fields.ContactRecord.AnniversaryDate,
    CategoryID: formData.categoryID,
    ClientID: fields.ContactRecord.ClientID,
    ClientSinceDate: fields.ContactRecord.ClientSinceDate,
    CompanyID: fields.ContactRecord.CompanyID,
    DateOfBirth: fields.ContactRecord.DateOfBirth,
    Designation: fields.ContactRecord.Designation,
    Family: fields.ContactRecord.Family,
    FamilyHeadID: fields.ContactRecord.FamilyHeadID,
    Familyname: formData.familyName,
    Firstname: formData.firstName,
    Gender: formData.gender,
    JobTitle: fields.ContactRecord.JobTitle,
    Lastname: formData.lastName,
    MaritalStatus: fields.ContactRecord.MaritalStatus,
    Middlename: formData.middleName,
    Name: fields.ContactRecord.Name,
    Nickname: formData.nickname,
    ReferredBy: formData.referredBy,
    Salutation: formData.salutation,
    ServicingAdvisorID: formData.servicingAdvisorID,
    SourceID: formData.sourceID,
    StatusID: formData.statusID,
    Suffix: fields.ContactRecord.Suffix,
    TaxID: fields.ContactRecord.TaxID,
    TypeID: fields.ContactRecord.ClientType,
    WritingAdvisorID: formData.writingAdvisorID,
  };

  const internet: InternetUpdate[] = fields.Internet
    ? fields.Internet.map((item) => {
        const fromForm:
          | EmailAddressFormData
          | undefined = formData.emailAddresses.find(
          (i) => i.recID === item.RecID
        );

        const updatedInternet: InternetUpdate = {
          Address: fromForm ? fromForm.emailAddress : item.Address,
          ClientID: item.ClientID,
          Label: item.Label,
          Preferred: item.Preferred,
          RecID: item.RecID,
          TypeID: fromForm ? fromForm.type : item.TypeID,
          Primary: fromForm ? fromForm.primaryEmail : item.Primary,
        };
        return updatedInternet;
      })
    : null;

  const phone: PhoneUpdate[] = fields.Internet
    ? fields.Phone.map((item) => {
        const fromForm:
          | PhoneNumberFormData
          | undefined = formData.phoneNumbers.find(
          (i) => i.recID === item.RecID
        );
        const updatedPhone: PhoneUpdate = {
          ClientID: item.ClientID,
          DisplayOrder: item.DisplayOrder,
          Extension: item.Extension,
          Label: item.Label,
          Number: fromForm ? fromForm.phoneNumber : item.Number,
          Preferred: item.Preferred,
          RecID: item.RecID,
          SharedPhoneNumber: item.SharedPhoneNumber,
          SpeedDial: item.SpeedDial,
          TypeID: fromForm ? fromForm.type : item.TypeID,
          Primary: fromForm ? fromForm.primaryPhone : item.Primary,
        };

        return updatedPhone;
      })
    : null;

  const contact: RedtailContactUpdate = {
    Address: address,
    ContactRecord: contactRecord,
    Internet: internet,
    Phone: phone,
  };

  return {
    contact,
  };
};
