export const applyLocalStorage = (
  updateOriginalFormData,
  updateFormData,
  updateFormDirty
) => {
  const localStorageOriginalFormData = JSON.parse(
    localStorage.getItem("dataCleanUpOriginalFormData")
  );
  const localStorageFormData = JSON.parse(
    localStorage.getItem("dataCleanUpFormData")
  );
  const localStorageFormDirty = JSON.parse(
    localStorage.getItem("dataCleanUpFormDirty")
  );

  if (localStorageOriginalFormData)
    updateOriginalFormData(localStorageOriginalFormData);

  if (localStorageFormData) updateFormData(localStorageFormData);

  if (localStorageFormDirty) updateFormDirty(localStorageFormDirty);

  return localStorageFormData;
};
