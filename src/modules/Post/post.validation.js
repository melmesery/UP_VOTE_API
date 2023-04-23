import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const createPost = {
  body: joi.object({
    title: joi.string().min(5).max(1500),
    caption: joi.string().min(5).max(15000),
  }),
  file: generalFields.file.required(),
};

export const reaction = {
  params: joi
    .object({
      id: generalFields.id,
    })
    .required(),
};

export const deletePost = {
  params: joi
    .object({
      id: generalFields.id,
    })
    .required(),
};

export const editPost = {
  body: joi.object({
    title: joi.string().min(5).max(1500),
    caption: joi.string().min(5).max(15000),
  }),
  file: generalFields.file,
  params: joi
    .object({
      id: generalFields.id,
    })
    .required(),
};

export const addComment = {
  body: joi
    .object({
      text: joi.string().min(5).max(15000).required(),
    })
    .required(),
  params: joi.object({
    id: generalFields.id,
  }),
};
