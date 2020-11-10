import {
  ContactListEntry,
  FilterData,
  FilterPageData,
  PageData,
} from "./redtail-contact-list.interface";
import { RedtailContactUpdate } from "./redtail-contact-update.interface";
import { RedtailSettingsData } from "./redtail-settings.interface";

export interface DataCleanUpLocalStorage {
  originalFormData?: Readonly<RedtailContactUpdate>;
  formData?: Readonly<RedtailContactUpdate>;
  formDirty?: boolean;
  contactList?: Readonly<ContactListEntry[]>;
  filteredContactList?: Readonly<ContactListEntry[]>;
  isFiltered?: boolean;
  filterPageData?: Readonly<FilterPageData>;
  pageData?: Readonly<PageData>;
  pageInputText?: string;
  contactPrevDisabled?: boolean;
  contactNextDisabled?: boolean;
  selectedFilter?: string;
  filterData?: Readonly<FilterData[]>;
  showFilters?: boolean;
  selectedContactID?: number;
  dropdownData?: Readonly<RedtailSettingsData>;
}
