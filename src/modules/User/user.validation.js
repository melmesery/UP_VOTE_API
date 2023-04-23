import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const profileData = {
  file: generalFields.file,
  body: joi.object({
    address: generalFields.address,
    phone: generalFields.phone,
    education: generalFields.education,
    bio: generalFields.bio,
  }),
};
