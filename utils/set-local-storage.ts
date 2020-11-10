import { DataCleanUpLocalStorage } from "../interfaces/linkpoint-form-interface";
import {
  ContactListEntry,
  FilterData,
  FilterPageData,
  PageData,
} from "../interfaces/redtail-contact-list.interface";
import { RedtailContactUpdate } from "../interfaces/redtail-contact-update.interface";

export const setLocalStorage = (
  originalFormData: Readonly<RedtailContactUpdate>,
  formData: Readonly<RedtailContactUpdate>,
  formDirty: boolean,
  contactList: Readonly<ContactListEntry[]>,
  filteredContactList: Readonly<ContactListEntry[]>,
  isFiltered: boolean,
  filterPageData: Readonly<FilterPageData>,
  pageData: Readonly<PageData>,
  pageInputText: string,
  contactPrevDisabled: boolean,
  contactNextDisabled: boolean,
  selectedFilter: string,
  filterData: Readonly<FilterData[]>,
  showFilters: boolean,
  selectedContactID: number
) => {
  const ls: DataCleanUpLocalStorage = {
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
    selectedContactID: selectedContactID,
  };

  localStorage.setItem("dataCleanUpLocalStorage", JSON.stringify(ls));
};
