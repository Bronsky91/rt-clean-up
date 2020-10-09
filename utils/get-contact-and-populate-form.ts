import Axios from "axios";
import { API_URL } from "../constants";
import { RedtailContactRec } from "../interfaces/redtail.interface";
import { v4 as uuid } from "uuid";

export const getContactAndPopulateForm = (
  updateSourceContactRef,
  updateFormData,
  formData,
  id
) => {
  return Axios.post(
    API_URL + "/rt/get-contact",
    { id },
    { withCredentials: true }
  ).then((res) => {
    const data: RedtailContactRec = res.data;
    console.log("RedtailContactRec data in getContactAndPopulateForm: " + JSON.stringify(data));
    updateSourceContactRef(data);

    updateFormData({
      key: formData.key,
      familyName: data.ContactRecord.Familyname,
      salutation: data.ContactRecord.Salutation
        ? data.ContactRecord.Salutation.toString()
        : "",
      firstName: data.ContactRecord.Firstname,
      middleName: data.ContactRecord.Middlename,
      lastName: data.ContactRecord.Lastname,
      nickname: data.ContactRecord.Nickname,
      gender: data.ContactRecord.Gender
        ? data.ContactRecord.Gender.toString()
        : "",
      categoryID: data.ContactRecord.CategoryID
        ? data.ContactRecord.CategoryID
        : 0,
      statusID: data.ContactRecord.StatusID
        ? data.ContactRecord.StatusID
        : 0,
      sourceID: data.ContactRecord.SourceID
        ? data.ContactRecord.SourceID
        : 0,
      referredBy: data.ContactRecord.ReferredBy,
      servicingAdvisorID: data.ContactRecord.ServicingAdvisorID
        ? data.ContactRecord.ServicingAdvisorID
        : 0,
      writingAdvisorID: data.ContactRecord.WritingAdvisorID
        ? data.ContactRecord.WritingAdvisorID
        : 0,
      phoneNumbers: data.Phone.map((obj, index) => ({
        key: uuid(),
        phoneNumber: obj.Number,
        type: obj.TypeID,
        primary: obj.Primary,
      })),
      emailAddresses: data.Internet.map((obj, index) => ({
        key: uuid(),
        emailAddress: obj.Address,
        type: obj.Type,
        primary: obj.Primary,
      })),
      streetAddresses: data.Address.map((obj, index) => ({
        key: uuid(),
        streetAddress: obj.Address1,
        secondaryAddress: obj.Address2,
        city: obj.City,
        state: obj.State,
        zip: obj.Zip,
        type: obj.TypeID,
        primary: obj.Primary,
      })),
    });
  });
};
