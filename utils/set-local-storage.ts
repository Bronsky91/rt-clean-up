import { SelectedContact } from "../interfaces/form.interface";
import {
  ContactFormData,
  RedtailContactRec,
} from "../interfaces/redtail.interface";

export const setLocalStorage = (
  selectedContact: SelectedContact,
  sourceContactRef: Readonly<RedtailContactRec>,
  originalFormData: Readonly<ContactFormData>,
  formData: Readonly<ContactFormData>,
  formDirty: boolean
) => {
  localStorage.setItem(
    "dataCleanUpSelectedContactData",
    JSON.stringify(selectedContact)
  );
  localStorage.setItem(
    "dataCleanUpSourceContactRef",
    JSON.stringify(sourceContactRef)
  );
  localStorage.setItem("dataCleanUpFormData", JSON.stringify(formData));
  localStorage.setItem(
    "dataCleanUpOriginalFormData",
    JSON.stringify(originalFormData)
  );
  localStorage.setItem("dataCleanUpFormDirty", JSON.stringify(formDirty));
};
