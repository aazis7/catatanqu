import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import { connectMongo } from "./lib/connectMongo.js";
import { logger } from "./utils/logger.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(compression());
app.use(helmet());

app.listen(PORT, async () => {
  await connectMongo();
  logger.info(`API Server listening on port ${PORT}`);
});

export default app;
