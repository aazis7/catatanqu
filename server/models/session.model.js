import { model, Schema, Types } from "mongoose";

import { sevenDaysFromNow } from "../utils/formatDate.js";

const sessionSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    index: true,
    required: true,
  },
  userAgent: {
    type: String,
    required: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: sevenDaysFromNow,
  },
});

export const Session = model("Session", sessionSchema);
