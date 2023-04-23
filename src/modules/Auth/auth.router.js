import { Router } from "express";
import auth from "../../middleware/auth.middleware.js";
import validation from "../../middleware/validation.js";
import * as validators from "../Auth/auth.validation.js";
import * as authController from "../Auth/controller/auth.js";
const router = Router();

router.post("/signup", validation(validators.signup), authController.signUp);

router.get("/confirmEmail/:token", authController.confirmEmail);

router.get("/newConfirmEmail/:token", authController.newConfirmEmail);

router.post("/login", validation(validators.login), authController.login);

router.get("/forgetPassword", authController.forgetPassword);

router.get(
  "/resetPassword/:token",
  validation(validators.resetPassword),
  authController.resetPassword
);

router.patch("/logout", auth, authController.logOut);

export default router;
