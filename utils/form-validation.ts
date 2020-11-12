import * as yup from "yup";

export const checkoutAddressSchema = yup.object().shape({
  email_address: yup.string().email().required(),
  full_name: yup.string().required(),
  house_no: yup.number().required().positive().integer(),
  address_1: yup.string().required(),
  address_2: yup.string(),
  post_code: yup.string().required(),
  timestamp: yup.date().default(() => new Date()),
});

export const emailSchema = yup.object().shape({
  address: yup.string().email().required(),
});
