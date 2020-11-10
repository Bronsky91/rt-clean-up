import { DataCleanUpLocalStorage } from "../interfaces/linkpoint-form-interface";

export const applyLocalStorage = (
  setOriginalFormData,
  setFormData,
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
  setAppliedFilterData,
  setShowFilters,
  setSelectedContactID,
  setDropdownData,
  setIsLocalStorageValid,
  setLocalStorageApplied
) => {
  const ls: DataCleanUpLocalStorage = JSON.parse(
    localStorage.getItem("dataCleanUpLocalStorage")
  );

  // If no LocalStorage object, bail out early
  if (!ls) {
    setIsLocalStorageValid(false);
    setLocalStorageApplied(true);
    return;
  }

  const lsSetters = {
    originalFormData: setOriginalFormData,
    formData: setFormData,
    contactList: setContactList,
    filteredContactList: setFilteredContactList,
    isFiltered: setIsFiltered,
    filterPageData: setFilterPageData,
    pageData: setPageData,
    pageInputText: setPageInputText,
    contactPrevDisabled: setContactPrevDisabled,
    contactNextDisabled: setContactNextDisabled,
    selectedFilter: setSelectedFilter,
    filterData: setFilterData,
    appliedFilterData: setAppliedFilterData,
    showFilters: setShowFilters,
    selectedContactID: setSelectedContactID,
    dropdownData: setDropdownData,
  };

  let isLocalStorageValid = true;

  for (const key of Object.keys(lsSetters)) {
    // Makes sure each setter variable is in local storage
    if (ls.hasOwnProperty(key)) {
      // Call setter and apply data if exists
      lsSetters[key](ls[key]);
    } else {
      // If data is missing, clear and return false for valid local storage to pull new data from API
      localStorage.clear();
      isLocalStorageValid = false;
      break;
    }
  }

  setIsLocalStorageValid(isLocalStorageValid);
  setLocalStorageApplied(true);
};
