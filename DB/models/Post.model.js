import mongoose, { Schema, model, Types } from "mongoose";

const postSchema = new Schema(
  {
    title: {
      type: String,
    },
    caption: {
      type: String,
    },
    image: { type: Object, required: true },
    like: [{ type: Types.ObjectId, ref: "User" }],
    dislike: [{ type: Types.ObjectId, ref: "User" }],
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const postModel = mongoose.models.Post || model("Post", postSchema);

export default postModel;
