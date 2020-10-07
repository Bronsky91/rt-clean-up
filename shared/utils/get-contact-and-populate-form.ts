import Axios from "axios";
import { API_URL } from "../../constants";
import { RedtailContactMaster } from "../../interfaces/redtail.interface";
import { v4 as uuid } from "uuid";

export const getContactAndPopulateForm = (updateFormData, formData, id) => {
  return Axios.post(
    API_URL + "/rt/get-contact",
    { id },
    { withCredentials: true }
  ).then((res) => {
    const data: RedtailContactMaster = res.data;
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
      category: data.ContactRecord.CategoryID
        ? data.ContactRecord.CategoryID.toString()
        : "",
      status: data.ContactRecord.StatusID
        ? data.ContactRecord.StatusID.toString()
        : "",
      source: data.ContactRecord.SourceID
        ? data.ContactRecord.SourceID.toString()
        : "",
      referredBy: data.ContactRecord.ReferredBy,
      servicingAdvisor: data.ContactRecord.ServicingAdvisorID
        ? data.ContactRecord.ServicingAdvisorID.toString()
        : "",
      writingAdvisor: data.ContactRecord.WritingAdvisorID
        ? data.ContactRecord.WritingAdvisorID.toString()
        : "",
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
