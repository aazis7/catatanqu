import { model, Schema, Types } from "mongoose";

import { oneDayFromNow } from "../utils/formatDate.js";

const verificationSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      index: true,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      default: oneDayFromNow,
      expires: 0,
    },
  },
  { timestamps: true },
);

export const Verification = model("Verification", verificationSchema);
