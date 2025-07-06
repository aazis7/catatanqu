import { HTTPException } from "../utils/HTTPException.js";

export const errorHandler = (err, req, res, next) => {
  if (req.headersSent) {
    next(err);
  }

  if (err instanceof HTTPException) {
    return res.status(err.status).json({
      message: err.message,
    });
  }

  if (err instanceof Error) {
    return res.status(400).json({
      message: err.message,
    });
  }

  return res.status(500).json({
    message: err?.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" && err.stack,
  });
};
