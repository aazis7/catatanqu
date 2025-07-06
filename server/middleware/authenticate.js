import { verifyToken } from "../lib/jwt.js";
import { Session } from "../models/session.model.js";
import { User } from "../models/user.model.js";
import { asyncController } from "../utils/asyncController.js";
import { HTTPException } from "../utils/HTTPException.js";

export const authenticate = asyncController(async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  }

  // If no token in header, check cookies
  if (!token) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw new HTTPException(401, "Access token not provided");
  }

  try {
    // Verify the token
    const decoded = await verifyToken(token, "access");

    // Check if session exists
    const session = await Session.findById(decoded.sessionId);
    if (!session) {
      throw new HTTPException(401, "Session not found");
    }

    // Check if user exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new HTTPException(401, "User not found");
    }

    // Update session last activity
    session.lastActivity = new Date();
    await session.save();

    // Add user info to request object
    req.user = {
      userId: user._id,
      sessionId: session._id,
      email: user.email,
      name: user.name,
      verified: user.verified,
    };

    next();
  } catch (error) {
    if (error instanceof HTTPException) {
      throw error;
    }
    throw new HTTPException(401, "Invalid access token");
  }
});

export const requireVerification = asyncController(async (req, res, next) => {
  if (!req.user) {
    throw new HTTPException(401, "Authentication required");
  }

  if (!req.user.verified) {
    throw new HTTPException(403, "Email verification required");
  }

  next();
});

export const optionalAuth = asyncController(async (req, res, next) => {
  try {
    await authenticate(req, res, next);
  } catch (error) {
    // Continue without authentication
    next();
  }
});
