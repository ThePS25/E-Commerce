import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 8080;
const clientDist = path.join(__dirname, "client-2", "dist");

await connectDB();

const app = express();

// Security & logging
app.use(helmet({
  contentSecurityPolicy: isProduction ? undefined : false,
  crossOriginEmbedderPolicy: false,
}));
app.use(morgan(isProduction ? "combined" : "dev"));

const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : isProduction
    ? [process.env.CLIENT_URL].filter(Boolean)
    : ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"];

app.use(cors({
  origin: corsOrigins.length ? corsOrigins : true,
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));

// Health check (for load balancers / uptime monitors)
app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/coupon", couponRoutes);

// Unknown API routes → JSON 404 (never SPA HTML)
app.use("/api", (_req, res) => {
  res.status(404).json({ success: false, message: "API route not found" });
});

// Serve client-2 production build
const indexHtml = path.join(clientDist, "index.html");

if (fs.existsSync(indexHtml)) {
  app.use(express.static(clientDist, {
    maxAge: isProduction ? "1d" : 0,
  }));

  // SPA fallback for client-side routes (Express 4 needs explicit paths)
  const sendSpa = (_req, res, next) => {
    res.sendFile(indexHtml, (err) => {
      if (err) next(err);
    });
  };

  app.get("/", sendSpa);
  app.get(/^\/(?!api).*/, sendSpa);
} else if (isProduction) {
  console.warn(
    `WARNING: ${indexHtml} not found. Run "npm run build" during deploy.`.yellow
  );
}

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("Server error:".red, err.message);
  res.status(err.status || 500).json({
    success: false,
    message: isProduction ? "Internal server error" : err.message,
  });
});

app.listen(PORT, () => {
  console.log(
    `ZooPHii API running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`.bgCyan.white
  );
  if (fs.existsSync(indexHtml)) {
    console.log(`Serving frontend from ${clientDist}`.green);
  }
});
