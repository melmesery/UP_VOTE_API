import userModel from "../../../../DB/models/User.model.js";
import { asyncHandler } from "../../../utils/ErrorHandling.js";

export const profile = asyncHandler(async (req, res, next) => {
  const User = await userModel.findById(req.user._id);
  return res.status(200).json({ message: "Done", User });
});

export const profileData = asyncHandler(async (req, res, next) => {
  const { bio, phone, education, address } = req.body;
  const User = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      bio,
      phone,
      education,
      address,
      profilePic: req.file?.dest,
    },
    { new: true }
  );
  return res.status(200).json({ message: "Done", User });
});



