import { logger } from "../utils/logger.js";

export const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const timestamp = new Date().toISOString();
    const format = `[${res.statusCode}] ${req.method} ${req.originalUrl || req.url} ${duration}ms ${timestamp}`;

    if (res.statusCode >= 400) {
      logger.warn(format);
    } else if (res.statusCode == 500) {
      logger.error(format);
    } else if (res.statusCode >= 200) {
      logger.info(format);
    } else {
      logger.log(format);
    }
  });

  next();
};
