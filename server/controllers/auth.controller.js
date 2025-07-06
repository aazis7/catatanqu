import { signAccessToken, signRefreshToken, verifyToken } from "../lib/jwt.js";
import { sendEmailVerification } from "../lib/resend.js";
import { Session } from "../models/session.model.js";
import { User } from "../models/user.model.js";
import { Verification } from "../models/verification.model.js";
import {
  EmailVerificationSchema,
  LoginSchema,
  PasswordResetRequestSchema,
  PasswordResetSchema,
  RegisterSchema,
} from "../schema/auth.schema.js";
import { asyncController } from "../utils/asyncController.js";
import { clearCookies, sendCookies } from "../utils/cookies.js";
import { generateRandomToken } from "../utils/generateRandomToken.js";
import { getClientInfo } from "../utils/getClientInfo.js";
import { compare } from "../utils/hash.js";
import { HTTPException } from "../utils/HTTPException.js";

export const login = asyncController(async (req, res, next) => {
  // Validate request body
  const { error, value: requestBody } = LoginSchema.validate(req.body);

  if (error) {
    throw new HTTPException(400, error.message);
  }

  // Check if user does not exist
  const user = await User.findOne({ email: requestBody.email }).select(
    "+password",
  );

  if (!user) {
    throw new HTTPException(400, "Invalid credentials");
  }

  // Check if user credentials match
  const isMatch = await compare(requestBody.password, user.password);

  if (!isMatch) {
    throw new HTTPException(400, "Invalid credentials");
  }

  // Call get client info
  const { userAgent, ipAddress } = getClientInfo(req);

  // Check session
  let session = await Session.findOne({
    userId: user._id,
  });

  if (!session) {
    session = await Session.create({
      userId: user._id,
      userAgent,
      ipAddress,
    });
  } else {
    // Update existing session
    session.userAgent = userAgent;
    session.ipAddress = ipAddress;
    session.lastActivity = new Date();
    await session.save();
  }

  // Create tokens
  const accessToken = await signAccessToken({
    sessionId: session._id,
    userId: user._id,
  });
  const refreshToken = await signRefreshToken({
    sessionId: session._id,
    userId: user._id,
  });

  sendCookies(res, accessToken, refreshToken);

  // Remove password from response
  const { password, ...userWithoutPassword } = user.toObject();

  return res.status(200).json({
    message: "Sign in success",
    user: userWithoutPassword,
  });
});

export const register = asyncController(async (req, res, next) => {
  // Validate request body
  const { error, value: requestBody } = RegisterSchema.validate(req.body);

  if (error) {
    throw new HTTPException(400, error.message);
  }

  // Check if user already registered
  const userExist = await User.findOne({ email: requestBody.email });

  if (userExist) {
    throw new HTTPException(400, "User already exist. Please login");
  }

  // Create the user
  const user = await User.create({
    name: requestBody.name,
    email: requestBody.email,
    password: requestBody.password,
    avatar: requestBody.avatar, // Optional
  });

  const { userAgent, ipAddress } = getClientInfo(req);

  // Create session
  const session = await Session.create({
    userId: user._id,
    ipAddress,
    userAgent,
  });

  // Create and send verification
  const verification = await Verification.create({
    userId: user._id,
    token: generateRandomToken(),
  });

  await sendEmailVerification(verification.token, user.email);

  // Create tokens
  const accessToken = await signAccessToken({
    sessionId: session._id,
    userId: user._id,
  });
  const refreshToken = await signRefreshToken({
    sessionId: session._id,
    userId: user._id,
  });

  sendCookies(res, accessToken, refreshToken);

  // Remove password from response
  const { password, ...userWithoutPassword } = user.toObject();

  return res.status(201).json({
    message: "Sign up success",
    user: userWithoutPassword,
  });
});

export const logout = asyncController(async (req, res, next) => {
  const { sessionId } = req.user;

  // Remove session from database
  await Session.findByIdAndDelete(sessionId);

  // Clear cookies
  clearCookies(res);

  return res.status(200).json({ message: "Logged out successfully" });
});

export const refreshToken = asyncController(async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new HTTPException(401, "Refresh token not provided");
  }

  try {
    const { sessionId, userId } = await verifyToken(refreshToken, "refresh");

    // Check if session exists
    const session = await Session.findById(sessionId);
    if (!session) {
      throw new HTTPException(401, "Session not found");
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new HTTPException(401, "User not found");
    }

    // Create new tokens
    const newAccessToken = await signAccessToken({
      sessionId: session._id,
      userId: user._id,
    });
    const newRefreshToken = await signRefreshToken({
      sessionId: session._id,
      userId: user._id,
    });

    sendCookies(res, newAccessToken, newRefreshToken);

    return res.status(200).json({
      message: "Token refreshed successfully",
      accessToken: newAccessToken,
    });
  } catch (error) {
    clearCookies(res);
    throw new HTTPException(401, "Invalid refresh token");
  }
});

export const verifyEmail = asyncController(async (req, res, next) => {
  const { error, value: requestBody } = EmailVerificationSchema.validate(
    req.body,
  );

  if (error) {
    throw new HTTPException(400, error.message);
  }

  // Find verification record
  const verification = await Verification.findOne({
    token: requestBody.token,
  }).populate("userId");

  if (!verification) {
    throw new HTTPException(400, "Invalid verification token");
  }

  // Check if token has expired (24 hours)
  const tokenAge = Date.now() - verification.createdAt.getTime();
  if (tokenAge > 24 * 60 * 60 * 1000) {
    await Verification.findByIdAndDelete(verification._id);
    throw new HTTPException(400, "Verification token has expired");
  }

  // Check if email matches
  if (verification.userId.email !== requestBody.email) {
    throw new HTTPException(400, "Email does not match verification token");
  }

  // Update user verification status
  await User.findByIdAndUpdate(verification.userId._id, {
    verified: true,
  });

  // Delete verification record
  await Verification.findByIdAndDelete(verification._id);

  return res.status(200).json({ message: "Email verified successfully" });
});

export const resendVerification = asyncController(async (req, res, next) => {
  const { userId } = req.user;

  // Find user
  const user = await User.findById(userId);
  if (!user) {
    throw new HTTPException(404, "User not found");
  }

  if (user.verified) {
    throw new HTTPException(400, "Email already verified");
  }

  // Delete existing verification tokens
  await Verification.deleteMany({ userId });

  // Create new verification
  const verification = await Verification.create({
    userId,
    token: generateRandomToken(),
  });

  await sendEmailVerification(verification.token, user.email);

  return res.status(200).json({ message: "Verification email sent" });
});

export const forgotPassword = asyncController(async (req, res, next) => {
  const { error, value: requestBody } = PasswordResetRequestSchema.validate(
    req.body,
  );

  if (error) {
    throw new HTTPException(400, error.message);
  }

  // Find user
  const user = await User.findOne({ email: requestBody.email });
  if (!user) {
    // Don't reveal if user exists or not
    return res.status(200).json({
      message:
        "If an account with that email exists, a reset link has been sent",
    });
  }

  // Delete existing reset tokens
  await Verification.deleteMany({ userId: user._id, type: "password_reset" });

  // Create reset token
  const resetToken = await Verification.create({
    userId: user._id,
    token: generateRandomToken(),
    type: "password_reset",
  });

  // Send password reset email (implement this function)
  // await sendPasswordResetEmail(resetToken.token, user.email);

  return res.status(200).json({
    message: "If an account with that email exists, a reset link has been sent",
  });
});

export const resetPassword = asyncController(async (req, res, next) => {
  const { error, value: requestBody } = PasswordResetSchema.validate(req.body);

  if (error) {
    throw new HTTPException(400, error.message);
  }

  // Find reset token
  const resetToken = await Verification.findOne({
    token: requestBody.token,
    type: "password_reset",
  }).populate("userId");

  if (!resetToken) {
    throw new HTTPException(400, "Invalid or expired reset token");
  }

  // Check if token has expired (1 hour)
  const tokenAge = Date.now() - resetToken.createdAt.getTime();
  if (tokenAge > 60 * 60 * 1000) {
    await Verification.findByIdAndDelete(resetToken._id);
    throw new HTTPException(400, "Reset token has expired");
  }

  // Update user password
  const user = await User.findById(resetToken.userId._id);
  user.password = requestBody.password;
  await user.save();

  // Delete reset token
  await Verification.findByIdAndDelete(resetToken._id);

  // Delete all user sessions (force re-login)
  await Session.deleteMany({ userId: user._id });

  return res.status(200).json({ message: "Password reset successfully" });
});

export const getProfile = asyncController(async (req, res, next) => {
  const { userId } = req.user;

  const user = await User.findById(userId);
  if (!user) {
    throw new HTTPException(404, "User not found");
  }

  return res.status(200).json({ user });
});

export const updateProfile = asyncController(async (req, res, next) => {
  const { userId } = req.user;
  const { error, value: requestBody } = ProfileUpdateSchema.validate(req.body);

  if (error) {
    throw new HTTPException(400, error.message);
  }

  const user = await User.findByIdAndUpdate(userId, requestBody, { new: true });

  if (!user) {
    throw new HTTPException(404, "User not found");
  }

  return res.status(200).json({
    message: "Profile updated successfully",
    user,
  });
});

export const getSessions = asyncController(async (req, res, next) => {
  const { userId } = req.user;

  const sessions = await Session.find({ userId }).sort({ lastActivity: -1 });

  return res.status(200).json({ sessions });
});

export const revokeSession = asyncController(async (req, res, next) => {
  const { userId } = req.user;
  const { sessionId } = req.params;

  const session = await Session.findOneAndDelete({
    _id: sessionId,
    userId,
  });

  if (!session) {
    throw new HTTPException(404, "Session not found");
  }

  return res.status(200).json({ message: "Session revoked successfully" });
});
