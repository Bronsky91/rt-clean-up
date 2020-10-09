export const applyLocalStorage = (
  updateSelectedContact,
  updateFormData,
  updateSourceContactRef
) => {
  const localStorageFormData = JSON.parse(
    localStorage.getItem("dataCleanUpFormData")
  );
  const localStorageSelectedContactData = JSON.parse(
    localStorage.getItem("dataCleanUpSelectedContactData")
  );
  const localStorageSourceContactRef = JSON.parse(
    localStorage.getItem("dataCleanUpSourceContactRef")
  );

  if (localStorageSelectedContactData)
    updateSelectedContact(localStorageSelectedContactData);

  if (localStorageFormData) updateFormData(localStorageFormData);

  if (localStorageSourceContactRef)
    updateSourceContactRef(localStorageSourceContactRef);

  return localStorageFormData;
};
