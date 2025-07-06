import { signAccessToken, signRefreshToken } from "../lib/jwt.js";
import { sendEmailVerification } from "../lib/resend.js";
import { Session } from "../models/session.model.js";
import { User } from "../models/user.model.js";
import { Verification } from "../models/verification.model.js";
import { LoginSchema, RegisterSchema } from "../schema/auth.schema.js";
import { asyncController } from "../utils/asyncController.js";
import { sendCookies } from "../utils/cookies.js";
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
  const user = await User.findOne({ email: requestBody.email });

  if (!user) {
    throw new HTTPEXception(400, "User not registered yet.");
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

  if (!user) {
    session = await Session.create({
      userId: user._id,
      userAgent,
      ipAddress,
    });
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
  return res.status(200).json({ message: "Sign in success", user });
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

  // Create the one
  const user = await User.create({
    name: requestBody.name,
    email: requestBody.email,
    password: requestBody.password,
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
  return res.status(200).json({ message: "Sign up success", user });
});
