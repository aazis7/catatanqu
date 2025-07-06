import { verifyAccessToken } from "../lib/jwt.js";
import { Session } from "../models/session.model.js";
import { User } from "../models/user.model.js";
import { HTTPException } from "../utils/HTTPException.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ") ||
      typeof authHeader !== "string"
    ) {
      throw new HTTPException(401, "No token provided");
    }

    // Extract token from Bearer prefix
    const token = authHeader.replace("Bearer ", "");

    // Verify the token
    const payload = await verifyAccessToken(token);

    // Check if session exists and is valid
    const session = await Session.findById(payload.sessionId);
    if (!session || session.expiresAt < new Date()) {
      throw new HTTPException(401, "Invalid or expired session");
    }

    // Get user data
    const user = await User.findById(payload.userId);
    if (!user) {
      throw new HTTPException(401, "User not found");
    }

    // Attach user and session to request
    req.user = user;
    req.session = session;
    req.userId = payload.userId;
    req.sessionId = payload.sessionId;

    next();
  } catch (error) {
    if (error instanceof HTTPException) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(401).json({ message: "Authentication failed" });
  }
};
