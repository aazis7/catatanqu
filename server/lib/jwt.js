import jwt from "jsonwebtoken";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error("JWT secrets not configured");
}

const signAccessTokenOptions = {
  expiresIn: "15m",
};

const signRefreshTokenOptions = {
  expiresIn: "7d",
};

export const signAccessToken = async ({ sessionId, userId }) => {
  return jwt.sign({ sessionId, userId }, JWT_ACCESS_SECRET, {
    ...signAccessTokenOptions,
  });
};

export const signRefreshToken = async ({ sessionId, userId }) => {
  return jwt.sign({ sessionId, userId }, JWT_REFRESH_SECRET, {
    ...signRefreshTokenOptions,
  });
};

export const verifyAccessToken = async (token) => {
  try {
    const payload = jwt.verify(token, JWT_ACCESS_SECRET);
    return payload;
  } catch (error) {
    throw new Error(`Failed to verify access token: ${error.message}`);
  }
};

export const verifyRefreshToken = async (token) => {
  try {
    const payload = jwt.verify(token, JWT_REFRESH_SECRET);
    return payload;
  } catch (error) {
    throw new Error(`Failed to verify refresh token: ${error.message}`);
  }
};
