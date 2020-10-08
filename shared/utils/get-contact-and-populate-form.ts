import Axios from "axios";
import { API_URL } from "../../constants";
import { RedtailContactRec } from "../../interfaces/redtail.interface";
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

    updateSourceContactRef(data);

    updateFormData({
      key: formData.key,
      familyName: data.Fields.Familyname,
      salutation: data.Fields.Salutation
        ? data.Fields.Salutation.toString()
        : "",
      firstName: data.Fields.Firstname,
      middleName: data.Fields.Middlename,
      lastName: data.Fields.Lastname,
      nickname: data.Fields.Nickname,
      gender: data.Fields.Gender ? data.Fields.Gender.toString() : "",
      category: data.Fields.CategoryID ? data.Fields.CategoryID.toString() : "",
      status: data.Fields.StatusID ? data.Fields.StatusID.toString() : "",
      source: data.Fields.SourceID ? data.Fields.SourceID.toString() : "",
      referredBy: data.Fields.ReferredBy,
      servicingAdvisor: data.Fields.ServicingAdvisorID
        ? data.Fields.ServicingAdvisorID.toString()
        : "",
      writingAdvisor: data.Fields.WritingAdvisorID
        ? data.Fields.WritingAdvisorID.toString()
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
