import { Router } from "express";
import auth from "../../middleware/auth.middleware.js";
import validation from "../../middleware/validation.js";
import { fileUpload, fileValidation } from "../../utils/Multer.js";
import * as commentController from "./controller/comment.js";
import * as postController from "./controller/post.js";
import * as validators from "./post.validation.js";

const router = Router();

router.get("/", postController.getAllPosts);

router.get("/user", auth, postController.getUserPosts);

router.post(
  "/",
  auth,
  fileUpload("post", fileValidation.image).single("image"),
  validation(validators.createPost),
  postController.createPost
);

router.patch(
  "/:id/like",
  auth,
  validation(validators.reaction),
  postController.like
);

router.patch(
  "/:id/dislike",
  auth,
  validation(validators.reaction),
  postController.dislike
);

router.delete(
  "/:id",
  auth,
  validation(validators.deletePost),
  postController.deletePost
);

router.patch(
  "/update/:id",
  auth,
  fileUpload("post", fileValidation.image).single("image"),
  validation(validators.editPost),
  postController.editPost
);

// ====== Comment Section ====== //

router.post(
  "/:id/comment",
  auth,
  validation(validators.addComment),
  commentController.addComment
);

export default router;
