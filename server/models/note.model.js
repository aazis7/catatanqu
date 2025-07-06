import { model, Schema, Types } from "mongoose";

const noteSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      index: true,
      required: true,
    },
    title: {
      type: String,
    },
    body: {
      type: String,
      trim: true,
      required: true,
    },
    tags: {
      type: [String],
    },
  },
  { timestamps: true },
);

export const Note = model("Note", noteSchema);
