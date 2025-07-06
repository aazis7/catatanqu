import { model, Schema } from "mongoose";

import { generateAvatarUrl } from "../utils/generateAvatarUrl.js";
import { hash } from "../utils/hash.js";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      index: true,
      required: true,
    },
    password: {
      type: String,
      select: false,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified()) {
    this.password = await hash(this.password);
    this.avatar = generateAvatarUrl(this.name);
  }
});

export const User = model("User", userSchema);
