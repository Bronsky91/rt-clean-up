import { FilterData } from "../interfaces/redtail-contact-list.interface";
import { RedtailContactUpdate } from "../interfaces/redtail-contact-update.interface";

export const setLocalStorage = (
  originalFormData: Readonly<RedtailContactUpdate>,
  formData: Readonly<RedtailContactUpdate>,
  formDirty: boolean,
  contactList,
  filteredContactList,
  isFiltered: boolean,
  filterPageData,
  pageData,
  pageInputText: string,
  contactPrevDisabled: boolean,
  contactNextDisabled: boolean,
  selectedFilter: string,
  filterData: Readonly<FilterData[]>,
  showFilters: boolean
) => {
  const ls = {
    originalFormData: originalFormData,
    formData: formData,
    formDirty: formDirty,
    contactList: contactList,
    filteredContactList: filteredContactList,
    isFiltered: isFiltered,
    filterPageData: filterPageData,
    pageData: pageData,
    pageInputText: pageInputText,
    contactPrevDisabled: contactPrevDisabled,
    contactNextDisabled: contactNextDisabled,
    selectedFilter: selectedFilter,
    filterData: filterData,
    showFilters: showFilters,
  };

  localStorage.setItem("dataCleanUpLocalStorage", JSON.stringify(ls));
};
