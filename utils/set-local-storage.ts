import { DataCleanUpLocalStorage } from "../interfaces/linkpoint-form-interface";
import {
  ContactListEntry,
  FilterData,
  FilterPageData,
  PageData,
} from "../interfaces/redtail-contact-list.interface";
import { RedtailContactUpdate } from "../interfaces/redtail-contact-update.interface";
import { RedtailSettingsData } from "../interfaces/redtail-settings.interface";

export const setLocalStorage = (
  originalFormData: Readonly<RedtailContactUpdate>,
  formData: Readonly<RedtailContactUpdate>,
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
  appliedFilterData: Readonly<FilterData[]>,
  showFilters: boolean,
  selectedContactID: number,
  dropdownData: Readonly<RedtailSettingsData>
) => {
  const ls: DataCleanUpLocalStorage = {
    originalFormData: originalFormData,
    formData: formData,
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
    appliedFilterData: appliedFilterData,
    showFilters: showFilters,
    selectedContactID: selectedContactID,
    dropdownData: dropdownData,
  };

  localStorage.setItem("dataCleanUpLocalStorage", JSON.stringify(ls));
};
