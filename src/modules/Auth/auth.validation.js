import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const signup = {
  body: joi
    .object({
      userName: generalFields.userName,
      email: generalFields.email,
      password: generalFields.password,
      cPassword: generalFields.cPassword.valid(joi.ref("password")).required(),
      age: generalFields.age,
    })
    .required(),
};

export const resetPassword = {
  body: joi
    .object({
      password: generalFields.password,
      cPassword: generalFields.cPassword.valid(joi.ref("password")).required(),
    })
    .required(),
};

export const login = {
  body: joi
    .object({
      email: generalFields.email,
      password: generalFields.password,
    })
    .required(),
};

export const logout = {
  headers: joi
    .object({
      id: generalFields.id,
    })
    .required(),
};
