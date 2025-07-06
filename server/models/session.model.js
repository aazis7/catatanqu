import { model, Schema, Types } from "mongoose";

import { sevenDaysFromNow } from "../utils/formatDate.js";

const sessionSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: "User",
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
  lastActivity: {
    type: Date,
    default: Date.now,
    expires: 7 * 24 * 60 * 60, // 7 days
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export const Session = model("Session", sessionSchema);
