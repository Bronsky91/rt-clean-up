import * as yup from "yup";
import {
  AddressUpdate,
  EmailUpdate,
  PhoneUpdate,
  UrlUpdate,
} from "../interfaces/redtail-contact-update.interface";

export const contactRecordSchema = yup.object().shape({
  last_name: yup.string().min(1).required(),
  tax_id: yup.string().matches(/^\d{9}$|^$/),
});

export const lastnameSchema = yup.object().shape({
  last_name: yup.string().min(1).required(),
});

export const taxSchema = yup.object().shape({
  tax_id: yup.string().matches(/^\d{9}$|^$/),
});

export const addressSchema = yup.object().shape({
  street_address: yup.string().min(1).required(),
  city: yup.string().min(1).required(),
  state: yup.string().min(2).required(),
  zip: yup.string().min(5).matches(/^\d+$/).required(),
});

export const streetAddressSchema = yup.object().shape({
  street_address: yup.string().min(1).required(),
});

export const citySchema = yup.object().shape({
  city: yup.string().min(1).required(),
});

export const stateSchema = yup.object().shape({
  state: yup.string().min(2).required(),
});

export const zipSchema = yup.object().shape({
  zip: yup
    .string()
    .min(5)
    .max(10)
    .matches(/^\d{5}(?:[-]\d{4})?$/)
    .required(),
});

export const emailSchema = yup.object().shape({
  address: yup.string().email().required(),
});

export const isPhoneValid = (number: string, country_code: string): boolean =>
  number &&
  country_code &&
  country_code.length > 0 &&
  number.length > country_code.length;

export const isPhoneInvalid = (phone: PhoneUpdate): boolean =>
  !(
    phone.number &&
    phone.country_code &&
    phone.country_code.toString().length > 0 &&
    phone.number.length > phone.country_code.toString().length
  );

export const urlSchema = yup.object().shape({
  address: yup
    .string()
    .matches(
      /((https?):\/\/)?(www.)?[a-z0-9-]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#-]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/
    )
    .required(),
});

export const isAllAddressValid = (addresses: AddressUpdate[]): boolean => {
  for (const address of addresses) {
    if (!addressSchema.isValidSync(address)) {
      return false;
    }
  }
  return true;
};

export const isAllEmailValid = (emails: EmailUpdate[]): boolean => {
  for (const email of emails) {
    if (!emailSchema.isValidSync(email)) {
      return false;
    }
  }
  return true;
};

export const isAllPhoneValid = (phones: PhoneUpdate[]): boolean => {
  for (const phone of phones) {
    if (isPhoneInvalid(phone)) {
      return false;
    }
  }
  return true;
};

export const isAllUrlValid = (urls: UrlUpdate[]): boolean => {
  for (const url of urls) {
    if (!urlSchema.isValidSync(url)) {
      return false;
    }
  }
  return true;
};
