import Axios from "axios";
import { API_URL } from "../constants";
import { v4 as uuid } from "uuid";
import { fromRedtailDatestring } from "./redtail-datestrings";
import { RedtailContactMasterRec } from "../interfaces/redtail-contact.interface";

export const getContactAndPopulateForm = (
  updateSourceContactRef,
  updateFormData,
  updateOriginalFormData,
  updateFormDirty,
  formData,
  id
) => {
  const genderMap = {
    M: "Male",
    F: "Female",
    Z: "Unknown",
  };

  return Axios.post(
    API_URL + "/rt/get-contact",
    { id },
    { withCredentials: true }
  ).then((res) => {
    const data: RedtailContactMasterRec = res.data;
    updateSourceContactRef(data);

    const loadedFormData = {
      key: formData.key,
      salutation: data.ContactRecord.Salutation
        ? data.ContactRecord.Salutation.toString()
        : "",
      firstName: data.ContactRecord.Firstname,
      middleName: data.ContactRecord.Middlename,
      lastName: data.ContactRecord.Lastname,
      nickname: data.ContactRecord.Nickname,
      dateOfBirth: fromRedtailDatestring(data.ContactRecord.DateOfBirth),
      gender: genderMap[data.ContactRecord.Gender],
      categoryID: data.ContactRecord.CategoryID
        ? data.ContactRecord.CategoryID
        : 0,
      statusID: data.ContactRecord.StatusID ? data.ContactRecord.StatusID : 0,
      sourceID: data.ContactRecord.SourceID ? data.ContactRecord.SourceID : 0,
      taxID: data.ContactRecord.TaxID ? data.ContactRecord.TaxID : "",
      servicingAdvisorID: data.ContactRecord.ServicingAdvisorID
        ? data.ContactRecord.ServicingAdvisorID
        : 0,
      writingAdvisorID: data.ContactRecord.WritingAdvisorID
        ? data.ContactRecord.WritingAdvisorID
        : 0,
      phoneNumbers: data.Phone.map((obj) => ({
        key: uuid(),
        recID: obj.RecID,
        phoneNumber: obj.Number,
        typeID: obj.TypeID,
        primaryPhone: obj.Primary,
      })),
      emailAddresses: data.Internet.map((obj) => ({
        key: uuid(),
        recID: obj.RecID,
        emailAddress: obj.Address,
        typeID: obj.TypeID,
        primaryEmail: obj.Primary,
      })),
      streetAddresses: data.Address.map((obj) => ({
        key: uuid(),
        recID: obj.RecID,
        streetAddress: obj.Address1,
        secondaryAddress: obj.Address2,
        city: obj.City,
        state: obj.State,
        zip: obj.Zip,
        typeID: obj.TypeID,
        primaryStreet: obj.Primary,
      })),
    };

    updateFormData(loadedFormData);
    updateOriginalFormData(JSON.parse(JSON.stringify(loadedFormData))); // force pass by val not ref
    updateFormDirty(false);
  });
};
