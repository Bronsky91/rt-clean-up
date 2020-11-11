import {
  ContactTypes,
  RedtailContactUpdate,
} from "../interfaces/redtail-contact-update.interface";

export const isIndividual = (formData: RedtailContactUpdate) =>
  formData.contactRecord.type === ContactTypes.Individual;
