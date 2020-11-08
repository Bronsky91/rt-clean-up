import { RedtailContactUpdate } from "../interfaces/redtail-contact-update.interface";

export const setLocalStorage = (
  originalFormData: Readonly<RedtailContactUpdate>,
  formData: Readonly<RedtailContactUpdate>,
  formDirty: boolean
) => {
  localStorage.setItem(
    "dataCleanUpOriginalFormData",
    JSON.stringify(originalFormData)
  );
  localStorage.setItem("dataCleanUpFormData", JSON.stringify(formData));
  localStorage.setItem("dataCleanUpFormDirty", JSON.stringify(formDirty));
};
