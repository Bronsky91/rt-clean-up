import { DataCleanUpLocalStorage } from "../interfaces/linkpoint-form-interface";

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
  setShowFilters,
  setSelectedContactID,
  setDropdownData,
  setIsLocalStorageValid,
  setLocalStorageApplied
) => {
  let isLocalStorageValid = true;

  const ls: DataCleanUpLocalStorage = JSON.parse(
    localStorage.getItem("dataCleanUpLocalStorage")
  );

  // If no LocalStorage object, bail out early
  if (!ls) {
    setIsLocalStorageValid(false);
    setLocalStorageApplied(true);
    return;
  }

  if (ls.hasOwnProperty("originalFormData")) {
    setOriginalFormData(ls.originalFormData);
  } else {
    isLocalStorageValid = false;
  }
  if (ls.hasOwnProperty("formData")) {
    setFormData(ls.formData);
  } else {
    isLocalStorageValid = false;
  }
  if (ls.hasOwnProperty("formDirty")) {
    setFormDirty(ls.formDirty);
  } else {
    isLocalStorageValid = false;
  }
  if (ls.hasOwnProperty("contactList")) {
    setContactList(ls.contactList);
  } else {
    isLocalStorageValid = false;
  }
  if (ls.hasOwnProperty("filteredContactList")) {
    setFilteredContactList(ls.filteredContactList);
  } else {
    isLocalStorageValid = false;
  }
  if (ls.hasOwnProperty("isFiltered")) {
    setIsFiltered(ls.isFiltered);
  } else {
    isLocalStorageValid = false;
  }
  if (ls.hasOwnProperty("filterPageData")) {
    setFilterPageData(ls.filterPageData);
  } else {
    isLocalStorageValid = false;
  }
  if (ls.hasOwnProperty("pageData")) {
    setPageData(ls.pageData);
  } else {
    isLocalStorageValid = false;
  }
  if (ls.hasOwnProperty("pageInputText")) {
    setPageInputText(ls.pageInputText);
  } else {
    isLocalStorageValid = false;
  }
  if (ls.hasOwnProperty("contactPrevDisabled")) {
    setContactPrevDisabled(ls.contactPrevDisabled);
  } else {
    isLocalStorageValid = false;
  }
  if (ls.hasOwnProperty("contactNextDisabled")) {
    setContactNextDisabled(ls.contactNextDisabled);
  } else {
    isLocalStorageValid = false;
  }
  if (ls.hasOwnProperty("selectedFilter")) {
    setSelectedFilter(ls.selectedFilter);
  } else {
    isLocalStorageValid = false;
  }
  if (ls.hasOwnProperty("filterData")) {
    setFilterData(ls.filterData);
  } else {
    isLocalStorageValid = false;
  }
  if (ls.hasOwnProperty("showFilters")) {
    setShowFilters(ls.showFilters);
  } else {
    isLocalStorageValid = false;
  }
  if (ls.hasOwnProperty("selectedContactID")) {
    setSelectedContactID(ls.selectedContactID);
  } else {
    isLocalStorageValid = false;
  }
  if (ls.hasOwnProperty("dropdownData")) {
    setDropdownData(ls.dropdownData);
  } else {
    isLocalStorageValid = false;
  }

  setIsLocalStorageValid(isLocalStorageValid);
  setLocalStorageApplied(true);
};
