export const applyLocalStorage = (updateOriginalFormData, updateFormData) => {
  const localStorageOriginalFormData = JSON.parse(
    localStorage.getItem("dataCleanUpOriginalFormData")
  );
  const localStorageFormData = JSON.parse(
    localStorage.getItem("dataCleanUpFormData")
  );

  if (localStorageOriginalFormData)
    updateOriginalFormData(localStorageOriginalFormData);

  if (localStorageFormData) updateFormData(localStorageFormData);

  return localStorageFormData;
};
