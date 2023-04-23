import userModel from "../../DB/models/User.model.js";
import { verifyToken } from "../utils/GenerateAndVerifyToken.js";

const auth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization?.startsWith(process.env.BEARER_KEY)) {
      return res.json({ message: "In-valid Bearer Key" });
    }
    const token = authorization.split(process.env.BEARER_KEY)[1];
    if (!token) {
      return res.json({ message: "In-valid Token" });
    }
    const decoded = verifyToken({ token });
    if (!decoded?.id) {
      return res.json("In-valid Token Payload");
    }
    const authUser = await userModel
      .findById(decoded.id)
      .select("userName email role status");
    if (!authUser) {
      return res.json({ message: "Not Authenticated User" });
    }
    req.user = authUser;
    return next();
  } catch (error) {
    return res.json({
      message: "Catch Error",
      error: error?.message,
      stack: error.stack,
    });
  }
};

export default auth;
