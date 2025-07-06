import { model, Schema, Types } from "mongoose";

import { oneDayFromNow } from "../utils/formatDate.js";

const verificationSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    index: true,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: oneDayFromNow,
  },
});

export const Verification = model("Verification", verificationSchema);
