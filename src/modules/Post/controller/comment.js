import commentModel from "../../../../DB/models/Comment.model.js";
import postModel from "../../../../DB/models/Post.model.js";
import { asyncHandler } from "../../../utils/ErrorHandling.js";

export const addComment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { _id } = req.user;
  const { text } = req.body;
  if (!(await postModel.findById(id))) {
    return next(new Error("In-valid Post Id"), { cause: 400 });
  }
  const Comment = await commentModel.create({ text, userId: _id, postId: id });
  return res.status(201).json({ message: "Done", Comment });
});
