import { Router } from "express";

import {
  forgotPassword,
  getProfile,
  getSessions,
  login,
  logout,
  refreshToken,
  register,
  resendVerification,
  resetPassword,
  revokeSession,
  updateProfile,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { rateLimit } from "../middleware/rateLimit.js";

const router = Router();

router.post(
  "/auth/login",
  rateLimit({ max: 5, windowMs: 15 * 60 * 1000 }),
  login,
);
router.post(
  "/auth/register",
  rateLimit({ max: 3, windowMs: 15 * 60 * 1000 }),
  register,
);
router.post("/auth/refresh", refreshToken);
router.post("/auth/verify-email", verifyEmail);
router.post(
  "/auth/forgot-password",
  rateLimit({ max: 3, windowMs: 15 * 60 * 1000 }),
  forgotPassword,
);
router.post(
  "/auth/reset-password",
  rateLimit({ max: 3, windowMs: 15 * 60 * 1000 }),
  resetPassword,
);

router.post("/auth/logout", authenticate, logout);
router.post("/auth/resend-verification", authenticate, resendVerification);
router.get("/auth/profile", authenticate, getProfile);
router.put("/auth/profile", authenticate, updateProfile);
router.get("/auth/sessions", authenticate, getSessions);
router.delete("/auth/sessions/:sessionId", authenticate, revokeSession);

export default router;
