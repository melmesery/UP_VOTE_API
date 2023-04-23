import commentModel from "../../../../DB/models/Comment.model.js";
import postModel from "../../../../DB/models/Post.model.js";
import { asyncHandler } from "../../../utils/ErrorHandling.js";

export const getAllPosts = asyncHandler(async (req, res, next) => {
  const Cursor = postModel
    .find({})
    .sort({ createdAt: -1 })
    .populate([
      {
        path: "userId",
      },
      {
        path: "like",
        select: "_id",
      },
      {
        path: "dislike",
        select: "_id",
      },
    ])
    .cursor();
  const PostList = [];
  for (let doc = await Cursor.next(); doc != null; doc = await Cursor.next()) {
    const Comment = await commentModel.find({ postId: doc._id }).populate({
      path: "userId",
      select: "userName profilePic",
    });
    PostList.push({ Post: doc, Comment });
  }
  return res.status(200).json({ message: "Done", PostList });
});

export const getUserPosts = asyncHandler(async (req, res, next) => {
  const Posts = await postModel
    .find({ userId: req.user._id })
    .populate("userId");
  if (!Posts) {
    return next(new Error("No Posts Found", { cause: 400 }));
  }
  return res.status(200).json({ message: "Done", Posts });
});

export const createPost = asyncHandler(async (req, res, next) => {
  const { title, caption } = req.body;
  const { _id } = req.user;
  const Post = await postModel.create({
    title,
    caption,
    image: req.file.dest,
    userId: _id,
  });
  return res.status(201).json({ message: "Done", Post });
});

export const like = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { _id } = req.user;
  const Post = await postModel.findOneAndUpdate(
    { _id: id },
    { $addToSet: { like: _id }, $pull: { dislike: _id } },
    { new: true }
  );
  return res.status(200).json({ message: "Done", Post });
});

export const dislike = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { _id } = req.user;
  const Post = await postModel.findOneAndUpdate(
    { _id: id },
    { $addToSet: { dislike: _id }, $pull: { like: _id } },
    { new: true }
  );
  return res.status(200).json({ message: "Done", Post });
});

export const deletePost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const Post = await postModel.findByIdAndDelete({ _id: id });
  if (!Post) {
    return next(new Error("No Post Found", { cause: 400 }));
  }
  return res.status(200).json({ message: "Done", Post });
});

export const editPost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title, caption } = req.body;
  const Post = await postModel.updateOne(
    { _id: id },
    {
      title,
      caption,
      image: req.file?.dest,
    }
  );
  return res.status(200).json({ message: "Done", Post });
});
