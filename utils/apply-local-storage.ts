export const applyLocalStorage = (
  setOriginalFormData,
  setFormData,
  setFormDirty,
  setContactList,
  setFilteredContactList,
  setIsFiltered,
  setFilterPageData,
  setPageData,
  setPageInputText,
  setContactPrevDisabled,
  setContactNextDisabled,
  setSelectedFilter,
  setFilterData,
  setShowFilters
) => {
  const ls = JSON.parse(localStorage.getItem("dataCleanUpLocalStorage"));

  if (ls?.originalFormData) setOriginalFormData(ls?.originalFormData);
  if (ls?.formData) setFormData(ls?.formData);
  if (ls?.formDirty) setFormDirty(ls?.formDirty);
  if (ls?.contactList) setContactList(ls?.contactList);
  if (ls?.filteredContactList) setFilteredContactList(ls?.filteredContactList);
  if (ls?.isFiltered) setIsFiltered(ls?.isFiltered);
  if (ls?.filterPageData) setFilterPageData(ls?.filterPageData);
  if (ls?.pageData) setPageData(ls?.pageData);
  if (ls?.pageInputText) setPageInputText(ls?.pageInputText);
  if (ls?.contactPrevDisabled) setContactPrevDisabled(ls?.contactPrevDisabled);
  if (ls?.contactNextDisabled) setContactNextDisabled(ls?.contactNextDisabled);
  if (ls?.selectedFilter) setSelectedFilter(ls?.selectedFilter);
  if (ls?.filterData) setFilterData(ls?.filterData);
  if (ls?.showFilters) setShowFilters(ls?.showFilters);
};
