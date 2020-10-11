import {
  ContactFormData,
  RedtailContactRec,
} from "../interfaces/redtail.interface";

export const undoContactChanges = (
  sourceContactRef: RedtailContactRec,
  updateFormData,
  formData: ContactFormData
) => {
  updateFormData({
    key: formData.key,
    familyName: sourceContactRef.ContactRecord.Familyname,
    salutation: sourceContactRef.ContactRecord.Salutation
      ? sourceContactRef.ContactRecord.Salutation.toString()
      : "",
    firstName: sourceContactRef.ContactRecord.Firstname,
    middleName: sourceContactRef.ContactRecord.Middlename,
    lastName: sourceContactRef.ContactRecord.Lastname,
    nickname: sourceContactRef.ContactRecord.Nickname,
    gender: sourceContactRef.ContactRecord.Gender
      ? sourceContactRef.ContactRecord.Gender.toString()
      : "",
    categoryID: sourceContactRef.ContactRecord.CategoryID
      ? sourceContactRef.ContactRecord.CategoryID
      : 0,
    statusID: sourceContactRef.ContactRecord.StatusID
      ? sourceContactRef.ContactRecord.StatusID
      : 0,
    sourceID: sourceContactRef.ContactRecord.SourceID
      ? sourceContactRef.ContactRecord.SourceID
      : 0,
    referredBy: sourceContactRef.ContactRecord.ReferredBy,
    servicingAdvisorID: sourceContactRef.ContactRecord.ServicingAdvisorID
      ? sourceContactRef.ContactRecord.ServicingAdvisorID
      : 0,
    writingAdvisorID: sourceContactRef.ContactRecord.WritingAdvisorID
      ? sourceContactRef.ContactRecord.WritingAdvisorID
      : 0,
    phoneNumbers: sourceContactRef.Phone.map((obj, index) => ({
      key: formData.phoneNumbers[index].key,
      recID: obj.RecID,
      phoneNumber: obj.Number,
      type: obj.TypeID,
      primaryPhone: obj.Primary,
    })),
    emailAddresses: sourceContactRef.Internet.map((obj, index) => ({
      key: formData.emailAddresses[index].key,
      recID: obj.RecID,
      emailAddress: obj.Address,
      type: obj.Type,
      primaryEmail: obj.Primary,
    })),
    streetAddresses: sourceContactRef.Address.map((obj, index) => ({
      key: formData.streetAddresses[index].key,
      recID: obj.RecID,
      streetAddress: obj.Address1,
      secondaryAddress: obj.Address2,
      city: obj.City,
      state: obj.State,
      zip: obj.Zip,
      type: obj.TypeID,
      primaryStreet: obj.Primary,
    })),
  });
};
