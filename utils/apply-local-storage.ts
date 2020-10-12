export const applyLocalStorage = (
  updateSelectedContact,
  updateSourceContactRef,
  updateFormData,
  updateOriginalFormData,
  updateFormDirty
) => {
  const localStorageSelectedContactData = JSON.parse(
    localStorage.getItem("dataCleanUpSelectedContactData")
  );
  const localStorageSourceContactRef = JSON.parse(
    localStorage.getItem("dataCleanUpSourceContactRef")
  );
  const localStorageFormData = JSON.parse(
    localStorage.getItem("dataCleanUpFormData")
  );
  const localStorageOriginalFormData = JSON.parse(
    localStorage.getItem("dataCleanUpOriginalFormData")
  );
  const localStorageFormDirty = JSON.parse(
    localStorage.getItem("dataCleanUpFormDirty")
  );

  if (localStorageSelectedContactData)
    updateSelectedContact(localStorageSelectedContactData);

  if (localStorageSourceContactRef)
    updateSourceContactRef(localStorageSourceContactRef);

  if (localStorageFormData) updateFormData(localStorageFormData);

  if (localStorageOriginalFormData)
    updateOriginalFormData(localStorageOriginalFormData);

  if (localStorageFormDirty) updateFormDirty(localStorageFormDirty);

  return localStorageFormData;
};
