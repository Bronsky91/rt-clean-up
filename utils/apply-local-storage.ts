export const applyLocalStorage = (updateSelectedContact, updateFormData) => {
  const localStorageFormData = JSON.parse(
    localStorage.getItem("dataCleanUpFormData")
  );
  const localStorageSelectedContactData = JSON.parse(
    localStorage.getItem("dataCleanUpSelectedContactData")
  );

  if (localStorageSelectedContactData)
    updateSelectedContact(localStorageSelectedContactData);

  if (localStorageFormData) updateFormData(localStorageFormData);

  return localStorageFormData
};
