import userModel from "../../../../DB/models/User.model.js";
import { asyncHandler } from "../../../utils/ErrorHandling.js";
import {
  generateToken,
  verifyToken,
} from "../../../utils/GenerateAndVerifyToken.js";
import { compare, hash } from "../../../utils/HashAndCompare.js";
import sendEmail from "../../../utils/SendEmail.js";

export const signUp = asyncHandler(async (req, res, next) => {
  const { userName, email, password, age } = req.body;
  const User = await userModel.findOne({ email });
  if (User) {
    return next(new Error("Email Exists", { cause: 409 }));
  }
  const token = generateToken({
    payload: { email },
    signature: process.env.EMAIL_TOKEN_SIGNATURE,
    expiresIn: 60 * 5,
  });
  const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`;
  const refreshToken = generateToken({
    payload: { email },
    signature: process.env.EMAIL_TOKEN_SIGNATURE,
    expiresIn: 60 * 60 * 24 * 30,
  });
  const refreshLink = `${req.protocol}://${req.headers.host}/auth/newConfirmEmail/${refreshToken}`;
  const html = `<a href="${link}">Click Here To Confirm Email</a> 
  <br/> 
  <br/> 
  <a href="${refreshLink}">Request New Email</a>`;
  if (!(await sendEmail({ to: email, subject: "Confirm Email", html }))) {
    return next(new Error("Rejected Email", { cause: 400 }));
  }
  const hashPassword = hash({ plainText: password });
  const createUser = await userModel.create({
    userName,
    email,
    password: hashPassword,
    age,
  });
  return res.status(201).json({ message: "Done", User: createUser._id });
});

export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { email } = verifyToken({
    token,
    signature: process.env.EMAIL_TOKEN_SIGNATURE,
  });
  const User = await userModel.updateOne({ email }, { confirmEmail: true });
  return User.modifiedCount
    ? res.status(200).redirect("https://www.facebook.com")
    : res.status(404).send("Account Not Registered");
});

export const newConfirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { email } = verifyToken({
    token,
    signature: process.env.EMAIL_TOKEN_SIGNATURE,
  });
  const newToken = generateToken({
    payload: { email },
    signature: process.env.EMAIL_TOKEN_SIGNATURE,
    expiresIn: 60 * 2,
  });
  const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${newToken}`;
  const refreshLink = `${req.protocol}://${req.headers.host}/auth/newConfirmEmail/${token}`;
  const html = `<a href="${link}">Click Here To Confirm Email</a> 
  <br/> 
  <br/> 
  <a href="${refreshLink}">Request New Email</a>`;
  if (!(await sendEmail({ to: email, subject: "Confirm Email", html }))) {
    return next(new Error("Rejected Email", { cause: 400 }));
  }
  return res.status(200).send("Please, Check Your Email");
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const User = await userModel.findOne({ email });
  if (!User || !User.confirmEmail) {
    return next(new Error("Email Not Exist", { cause: 404 }));
  }
  const match = compare({ plainText: password, hashValue: User.password });
  if (!match) {
    return next(new Error("In-valid Password", { cause: 400 }));
  }
  const token = generateToken({
    payload: { id: User._id, isLoggedIn: true, role: User.role },
  });
  User.userStatus = "online";
  await User.save();
  return res.status(200).json({ message: "Done", token });
});

export const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const User = await userModel.findOne({ email });
  if (!User) {
    return next(new Error("Email Not Exist", { cause: 404 }));
  }
  const token = generateToken({
    payload: { email },
    signature: process.env.EMAIL_TOKEN_SIGNATURE,
    expiresIn: 60 * 5,
  });
  const link = `${req.protocol}://${req.headers.host}/auth/resetPassword/${token}`;
  const html = `<a href="${link}">Click Here To Reset Password</a>`;
  if (!(await sendEmail({ to: email, subject: "Reset Password", html }))) {
    return next(new Error("Rejected Email", { cause: 400 }));
  }
  return res.status(200).send("Please, Check Your Email");
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;
  const { email } = verifyToken({
    token,
    signature: process.env.EMAIL_TOKEN_SIGNATURE,
  });
  const hashPassword = hash({ plainText: password });
  const User = await userModel.updateOne({ email }, { password: hashPassword });
  return User.modifiedCount
    ? res.status(200).json({ message: "Done" })
    : next(new Error("Can't Reset Password", { cause: 500 }));
});

export const logOut = asyncHandler(async (req, res) => {
  const User = await userModel.findByIdAndUpdate(req.user._id, {
    userStatus: "offline",
  });
  localStorage.removeItem("token");
  return res.status(200).json({ message: "Done" });
});
