import {
  RedtailContactRec,
  RedtailContactUpdate,
  ContactFieldsUpdate,
  ContactFormData,
} from "../interfaces/redtail.interface";

export const prepareContactSubmitData = (
  formData: ContactFormData,
  fields: RedtailContactRec
) => {
  return {
    // TODO: update to include street addresses, email addresses, phone numbers
    Fields: {
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
    },
  };
};
