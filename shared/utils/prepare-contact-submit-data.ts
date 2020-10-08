import {
  RedtailContactRec,
  RedtailContactUpdate,
  ContactFieldsUpdate,
  ContactFormData,
} from "../../interfaces/redtail.interface";

export const prepareContactSubmitData = (
  formData: ContactFormData,
  contactRec: RedtailContactRec
) => {
  return {
    // TODO: update to include street addresses, email addresses, phone numbers
    Fields: {
      AnniversaryDate: contactRec.Fields.AnniversaryDate,
      CategoryID: formData.categoryID,
      ClientID: contactRec.Fields.ClientID,
      ClientSinceDate: contactRec.Fields.ClientSinceDate,
      CompanyID: contactRec.Fields.CompanyID,
      DateOfBirth: contactRec.Fields.DateOfBirth,
      Designation: contactRec.Fields.Designation,
      Family: contactRec.Fields.Family,
      FamilyHeadID: contactRec.Fields.FamilyHeadID,
      Familyname: formData.familyName,
      Firstname: formData.firstName,
      Gender: formData.gender,
      JobTitle: contactRec.Fields.JobTitle,
      Lastname: formData.lastName,
      MaritalStatus: contactRec.Fields.MaritalStatus,
      Middlename: formData.middleName,
      Name: contactRec.Fields.Name,
      Nickname: formData.nickname,
      ReferredBy: formData.referredBy,
      Salutation: formData.salutation,
      ServicingAdvisorID: formData.servicingAdvisorID,
      SourceID: formData.sourceID,
      StatusID: formData.statusID,
      Suffix: contactRec.Fields.Suffix,
      TaxID: contactRec.Fields.TaxID,
      TypeID: contactRec.Fields.ClientType,
      WritingAdvisorID: formData.writingAdvisorID,
    } as ContactFieldsUpdate,
  } as RedtailContactUpdate;
};
