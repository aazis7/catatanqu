import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import { connectMongo } from "./lib/connectMongo.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import { requestLogger } from "./middleware/requestLogger.js";
import authRoute from "./routes/auth.route.js";
import { logger } from "./utils/logger.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "4mb" }));
app.use(express.urlencoded({ extended: true, limit: "4mb" }));
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : process.env.FRONTEND_URL,
    exposedHeaders: ["Authorization"],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(compression());
app.use(helmet());
app.use(requestLogger);

app.get("/api/message", (_, res) => {
  res.status(200).json({ message: "It works!" });
});

app.use("/api", authRoute);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, async () => {
  await connectMongo();
  logger.info(`API Server listening on port ${PORT}`);
});

export default app;
