
import { AddressUpdate, ContactFieldsUpdate, InternetUpdate, PhoneUpdate, RedtailContactUpdate } from "../interfaces/redtail-contact-update.interface";
import { AddressRec, InternetRec, PhoneRec, RedtailContactMasterRec } from "../interfaces/redtail-contact.interface";
import { ContactFormData, EmailAddressFormData, PhoneNumberFormData, StreetAddressFormData } from "../interfaces/redtail-form.interface";
import { toRedtailDatestring } from "./redtail-datestrings";

export const prepareContactSubmitData = (
  formData: ContactFormData,
  fields: RedtailContactMasterRec
) => {

  const contactRecord: ContactFieldsUpdate = {
    AnniversaryDate: fields.ContactRecord.AnniversaryDate,
    CategoryID: formData.categoryID,
    ClientID: fields.ContactRecord.ClientID,
    ClientSinceDate: fields.ContactRecord.ClientSinceDate,
    CompanyID: fields.ContactRecord.CompanyID,
    DateOfBirth: toRedtailDatestring(formData.dateOfBirth),
    Designation: fields.ContactRecord.Designation,
    Family: fields.ContactRecord.Family,
    FamilyHeadID: fields.ContactRecord.FamilyHeadID,
    Familyname: fields.ContactRecord.Familyname,
    Firstname: formData.firstName,
    Gender: formData.gender,
    JobTitle: fields.ContactRecord.JobTitle,
    Lastname: formData.lastName,
    MaritalStatus: fields.ContactRecord.MaritalStatus,
    Middlename: formData.middleName,
    Name: fields.ContactRecord.Name,
    Nickname: formData.nickname,
    ReferredBy: fields.ContactRecord.ReferredBy,
    Salutation: formData.salutation,
    ServicingAdvisorID: formData.servicingAdvisorID,
    SourceID: formData.sourceID,
    StatusID: formData.statusID,
    Suffix: fields.ContactRecord.Suffix,
    TaxID: formData.taxID,
    TypeID: fields.ContactRecord.ClientType,
    WritingAdvisorID: formData.writingAdvisorID,
  };

  const internet: InternetUpdate[] = formData.emailAddresses.map((item) => {

    const fromSource:
      | InternetRec
      | undefined = fields.Internet.find(
      (i) => i.RecID === item.recID
    );

    const updatedInternet: InternetUpdate = {
      Address: item.emailAddress,
      ClientID: contactRecord.ClientID,
      Label: fromSource? fromSource.Label : '',
      Preferred: fromSource? fromSource.Preferred : false,
      RecID: item.recID,
      TypeID: item.typeID,
      Primary: item.primaryEmail,
    };
    return updatedInternet;
  })

  const phone: PhoneUpdate[] = formData.phoneNumbers.map((item) => {

    const fromSource:
    | PhoneRec
    | undefined = fields.Phone.find(
      (i) => i.RecID === item.recID
    );
    const updatedPhone: PhoneUpdate = {
      ClientID: contactRecord.ClientID,
      DisplayOrder: fromSource? fromSource.DisplayOrder : 0,
      Extension: fromSource? fromSource.Extension : "",
      Label: fromSource? fromSource.Label : "",
      Number: item.phoneNumber,
      Preferred: fromSource? fromSource.Preferred : false,
      RecID: item.recID,
      SharedPhoneNumber: fromSource? fromSource.SharedPhoneNumber : false,
      SpeedDial: fromSource? fromSource.SpeedDial : "",
      TypeID: item.typeID,
      Primary:  item.primaryPhone,
    };

    return updatedPhone;
  })

    const address: AddressUpdate[] = formData.streetAddresses.map((item) => {
      const fromSource:
      | AddressRec
      | undefined = fields.Address.find(
        (i) => i.RecID === item.recID
      );

      return {
        Address1: item.streetAddress,
        Address2: item.secondaryAddress,
        City:  item.city,
        ClientID: contactRecord.ClientID,
        Label: fromSource? fromSource.Label : "",
        Preferred: fromSource? fromSource.Preferred : false,
        Primary: item.primaryStreet,
        RecID: item.recID,
        SharedAddress: fromSource? fromSource.SharedAddress : false,
        State: item.state,
        TypeID: item.typeID,
        Zip: item.zip,
      };
    })

  const contactFieldsToDelete = formData.contactFieldsToDelete

  const contact: RedtailContactUpdate = {
    Address: address,
    ContactRecord: contactRecord,
    Internet: internet,
    Phone: phone,
    contactFieldsToDelete
  };

  return {
    contact,
  };
};
