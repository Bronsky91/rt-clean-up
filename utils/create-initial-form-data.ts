import { ContactFormData, RedtailSettingsData } from "../interfaces/redtail.interface";
import { v4 as uuid } from "../node_modules/uuid";

export const createInitalFormData = (): Readonly<ContactFormData> =>
  Object.freeze({
    key: uuid(),
    familyName: "",
    salutation: "",
    firstName: "",
    middleName: "",
    lastName: "",
    nickname: "",
    gender: "",
    categoryID: 0,
    statusID: 0,
    sourceID: 0,
    referredBy: "",
    servicingAdvisorID: 0,
    writingAdvisorID: 0,
    phoneNumbers: [{ key: uuid(), phoneNumber: "", type: "", primary: false }],
    emailAddresses: [
      { key: uuid(), emailAddress: "", type: "", primary: false },
    ],
    streetAddresses: [
      {
        key: uuid(),
        streetAddress: "",
        secondaryAddress: "",
        city: "",
        state: "",
        zip: "",
        type: "",
        primary: false,
      },
    ],
  });

export const createInitialDropDownData = (): Readonly<RedtailSettingsData> =>
  Object.freeze({
    statuses: [],
    categories: [],
    sources: [],
    salutations: [],
    servicingAdvisors: [],
    writingAdvisors: [],
  });
