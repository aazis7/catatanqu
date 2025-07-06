import mongoose from "mongoose";

import { logger } from "../utils/logger.js";

export const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "catatanqu_db",
      maxPoolSize: 20,
      maxConnecting: 15,
    });
    logger.info(`Connected to MongoDB`);
  } catch (error) {
    logger.error(`Failed to connect MongoDB ${error}`);
    process.exit(1);
  }
};
