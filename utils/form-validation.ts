import * as yup from "yup";
import { PhoneUpdate } from "../interfaces/redtail-contact-update.interface";

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
  zip: yup.string().min(5).matches(/^\d+$/).required(),
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
