import { SelectedContact } from "../interfaces/form.interface";
import { RedtailContactMasterRec } from "../interfaces/redtail-contact.interface";
import { ContactFormData } from "../interfaces/redtail-form.interface";

export const setLocalStorage = (
  selectedContact: SelectedContact,
  sourceContactRef: Readonly<RedtailContactMasterRec>,
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
