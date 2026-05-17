import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import connectDB from "./config/database";
import authRoutes from "./routes/auth";
import leadRoutes from "./routes/leads";
import { notFound, errorHandler } from "./middleware/errorHandler";
import config from "./config/config";

const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet());

// CORS
app.use(
  cors({
    origin: config.FRONTEND_URL as string,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(config.RATE_LIMIT_WINDOW_MS as string),
  max: parseInt(config.RATE_LIMIT_MAX as string),
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/", limiter);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Smart Leads API is running",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(
    `🚀 Server running on port ${config.PORT} in ${config.NODE_ENV} mode`,
  );
});
