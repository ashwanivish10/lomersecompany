import 'dotenv/config'; // MUST be the first import
import express, { type Request, Response, NextFunction } from "express";
import session from 'express-session';
import passport from 'passport';
import paymentRoutes from "./paymentRoutes";

import { registerRoutes } from "./routes";
import authRoutes from './routes/authRoutes';
import apiRoutes from './routes/apiRoutes'; // Naya route import kiya
import { setupVite, serveStatic, log } from "./vite";
import { connectDB } from "./models";
import './config/passport-setup'; // This executes the Passport configuration

const app = express();

// Connect to MongoDB
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1); // Exit if DB connection fails
});

// Razorpay webhook needs raw body for signature verification
// IMPORTANT: This must be placed before express.json()
app.use('/api/razorpay-webhook', express.raw({ type: 'application/json' }));

// Standard middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// NEW: Session and Passport middleware setup
// ===================================================
app.use(
  session({
    secret: process.env.SESSION_SECRET!, // Secret key to sign the session ID cookie
    resave: false,                      // Don't save session if unmodified
    saveUninitialized: false,             // Don't create session until something stored
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 // Session cookie expires in 24 hours
    }
  })
);

// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());
// ===================================================


// Custom logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api") || path.startsWith("/auth")) { // Added /auth to logging
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Register the new authentication routes under the /auth path
  app.use('/auth', authRoutes);

  // --- YEH HAI UPDATE: Humare naye API routes (profile, settings, etc.) ---
  app.use('/api', apiRoutes);

  // This function now registers your main API routes (invoices, payments, etc.)
  const server = await registerRoutes(app);

  // Generic error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    console.error(err);
  });

  // Setup Vite for development or serve static files for production
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Start the server
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
  }, () => {
    log(`serving on port ${port}`);
  });
})();

