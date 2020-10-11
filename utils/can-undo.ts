import {
  ContactFormData,
  RedtailContactRec,
} from "../interfaces/redtail.interface";

export const canUndo = (
  sourceContactRef: RedtailContactRec,
  formData: ContactFormData
): boolean => {
  const streetMatch = (): boolean => {
    return formData.streetAddresses && sourceContactRef.Address
      ? formData.streetAddresses.every((f) => {
          return sourceContactRef.Address.find((s) => {
            s.RecID === f.recID &&
              s.Address1 === f.streetAddress &&
              s.Address2 === f.secondaryAddress &&
              s.City === f.city &&
              s.State === f.state &&
              s.Zip === f.zip &&
              s.TypeID === f.type &&
              s.Primary === f.primaryStreet;
          });
        })
      : true;
  };

  const emailMatch = (): boolean => {
    return formData.emailAddresses && sourceContactRef.Internet
      ? formData.emailAddresses.every((f) => {
          return sourceContactRef.Internet.find((s) => {
            s.RecID === f.recID &&
              s.Address === f.emailAddress &&
              s.TypeID === f.type &&
              s.Primary === f.primaryEmail;
          });
        })
      : true;
  };

  const phoneMatch = (): boolean => {
    return formData.phoneNumbers && sourceContactRef.Phone
      ? formData.phoneNumbers.every((f) => {
          return sourceContactRef.Phone.find((s) => {
            s.RecID === f.recID &&
              s.Number === f.phoneNumber &&
              s.TypeID === f.type;
          });
        })
      : true;
  };

  const delta: boolean = !(
    formData.familyName == sourceContactRef.ContactRecord.Familyname &&
    formData.salutation ==
      sourceContactRef.ContactRecord.Salutation.toString() &&
    formData.firstName == sourceContactRef.ContactRecord.Firstname &&
    formData.middleName == sourceContactRef.ContactRecord.Middlename &&
    formData.lastName == sourceContactRef.ContactRecord.Lastname &&
    formData.nickname == sourceContactRef.ContactRecord.Nickname &&
    formData.gender == sourceContactRef.ContactRecord.Gender.toString() &&
    formData.categoryID == sourceContactRef.ContactRecord.CategoryID &&
    formData.sourceID == sourceContactRef.ContactRecord.SourceID &&
    formData.referredBy == sourceContactRef.ContactRecord.ReferredBy &&
    formData.servicingAdvisorID ==
      sourceContactRef.ContactRecord.ServicingAdvisorID &&
    formData.writingAdvisorID ==
      sourceContactRef.ContactRecord.WritingAdvisorID &&
    streetMatch() &&
    emailMatch() &&
    phoneMatch()
  );

  return delta;
};
