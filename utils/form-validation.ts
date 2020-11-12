import * as yup from "yup";

export const emailSchema = yup.object().shape({
  address: yup.string().email().required(),
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
