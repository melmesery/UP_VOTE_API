import { Router } from "express";
import auth from "../../middleware/auth.middleware.js";
import validation from "../../middleware/validation.js";
import { fileUpload, fileValidation } from "../../utils/Multer.js";
import * as userController from "./controller/user.js";
import * as validators from "./user.validation.js";

const router = Router();

router.get("/", auth, userController.profile);

router.patch(
  "/profile",
  auth,
  fileUpload("user/profile", fileValidation.image).single("image"),
  validation(validators.profileData),
  userController.profileData
);

export default router;
