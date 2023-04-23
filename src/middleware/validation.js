import joi from "joi";
import { Types } from "mongoose";

const dataMethods = ["body", "query", "params", "headers", "file"];

const validateObjectId = (value, helper) => {
  return Types.ObjectId.isValid(value)
    ? true
    : helper.message("In-valid Object ID");
};

export const generalFields = {
  userName: joi.string().min(2).max(20).required().messages({
    "any.required": "Please Enter Username",
    "string.base": "Username Accepts Only Alphanum",
    "string.empty": "Please Fill Username",
  }),
  password: joi
    .string()
    .pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/))
    .required(),
  cPassword: joi.string().required(),
  email: joi
    .string()
    .email({ maxDomainSegments: 3, tlds: { allow: ["com", "net"] } })
    .required(),
  age: joi.number().integer().min(16).max(100).required(),
  id: joi.string().custom(validateObjectId).required(),
  file: joi.object({
    size: joi.number().positive().required(),
    path: joi.string().required(),
    filename: joi.string().required(),
    destination: joi.string().required(),
    mimetype: joi.string().required(),
    encoding: joi.string().required(),
    originalname: joi.string().required(),
    fieldname: joi.string().required(),
    dest: joi.string(),
  }),
  title: joi.string().required(),
  genre: joi.string().required(),
  address: joi.string(),
  phone: joi.string(),
  education: joi.string(),
  bio: joi.string(),
};

const validation = (schema) => {
  return (req, res, next) => {
    const validationErr = [];
    dataMethods.forEach((key) => {
      if (schema[key]) {
        const validationResult = schema[key].validate(req[key], {
          abortEarly: false,
        });
        if (validationResult.error) {
          validationErr.push(validationResult.error.details);
        }
      }
    });
    if (validationErr.length > 0) {
      return res
        .status(400)
        .json({ message: "Validation Error", validationErr });
    } else {
      return next();
    }
  };
};

export default validation;
