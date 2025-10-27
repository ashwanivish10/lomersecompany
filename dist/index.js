// server/index.ts
import "dotenv/config";
import express2 from "express";
import session from "express-session";
import passport3 from "passport";

// server/routes.ts
import { createServer } from "http";

// server/models.ts
import mongoose from "mongoose";
var userSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  // Using Replit user ID
  email: { type: String, unique: true, sparse: true },
  firstName: String,
  lastName: String,
  profileImageUrl: String,
  // Razorpay fields for payment integration
  razorpayCustomerId: String,
  razorpaySubscriptionId: String,
  // Subscription status
  subscriptionTier: { type: String, default: "free", enum: ["free", "monthly", "yearly"] },
  subscriptionStatus: { type: String, default: "inactive", enum: ["active", "inactive", "canceled"] },
  subscriptionEndsAt: Date,
  // Credits for pay-per-invoice (in paise for accuracy)
  invoiceCredits: { type: Number, default: 0 }
}, {
  timestamps: true
});
var invoiceSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: "User", index: true },
  invoiceNumber: { type: String, required: true },
  theme: { type: String, required: true, default: "default" },
  // Invoice content
  companyName: { type: String, required: true },
  companyTagline: String,
  logoUrl: String,
  clientName: { type: String, required: true },
  invoiceDate: { type: String, required: true },
  items: { type: mongoose.Schema.Types.Mixed, required: true },
  // Array of invoice items
  totalAmount: { type: Number, required: true },
  // In paise
  amountPaid: { type: Number, default: 0 },
  tax: { type: String, default: "0%" },
  address: String,
  phone: String
}, {
  timestamps: true
});
var paymentSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: "User", index: true },
  razorpayPaymentId: String,
  razorpayOrderId: String,
  razorpaySubscriptionId: String,
  amount: { type: Number, required: true },
  // In paise
  currency: { type: String, default: "INR" },
  paymentType: { type: String, required: true, enum: ["invoice", "subscription_monthly", "subscription_yearly"] },
  status: { type: String, required: true, enum: ["pending", "succeeded", "failed"] }
}, {
  timestamps: true
});
var User = mongoose.model("User", userSchema);
var Invoice = mongoose.model("Invoice", invoiceSchema);
var Payment = mongoose.model("Payment", paymentSchema);
async function connectDB() {
  try {
    const mongoUrl = process.env.MONGODB_URI || process.env.MONGODB_URL;
    if (!mongoUrl) {
      console.warn("MongoDB connection string not provided. Please set MONGODB_URI or MONGODB_URL environment variable.");
      return;
    }
    await mongoose.connect(mongoUrl);
    console.log("\u2713 Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

// server/storage.ts
var MongoDBStorage = class {
  // User operations
  async getUser(id) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      const userByGoogleId = await User.findOne({ _id: id }).lean();
      if (!userByGoogleId) return void 0;
      return { ...userByGoogleId, id: userByGoogleId._id };
    }
    const user = await User.findById(id).lean();
    if (!user) return void 0;
    return { ...user, id: user._id };
  }
  async upsertUser(userData) {
    const user = await User.findByIdAndUpdate(
      userData.id,
      userData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();
    return { ...user, id: user._id };
  }
  async createUser(userData) {
    const userToCreate = {
      ...userData,
      _id: userData.id
    };
    const created = await User.create(userToCreate);
    const doc = created.toObject();
    return { ...doc, id: doc._id };
  }
  async updateUserSubscription(id, data) {
    const user = await User.findByIdAndUpdate(
      id,
      data,
      { new: true }
    ).lean();
    if (!user) throw new Error("User not found");
    return { ...user, id: user._id };
  }
  // --- YEH NAYA FUNCTION CLASS MEIN ADD KIYA ---
  async updateUser(id, updates) {
    try {
      const user = await User.findByIdAndUpdate(
        id,
        { $set: updates },
        // $set use karein taaki poora document replace na ho
        { new: true }
      ).lean();
      if (!user) {
        throw new Error("User not found during update");
      }
      return { ...user, id: user._id };
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  }
  // --- NAYA FUNCTION ENDS ---
  // Invoice operations
  async createInvoice(invoice) {
    const created = await Invoice.create(invoice);
    const doc = created.toObject();
    return { ...doc, id: doc._id.toString() };
  }
  async getInvoicesByUser(userId) {
    const invoices = await Invoice.find({ userId }).sort({ createdAt: -1 }).lean();
    return invoices.map((inv) => ({ ...inv, id: inv._id.toString() }));
  }
  async getInvoice(id) {
    const invoice = await Invoice.findById(id).lean();
    if (!invoice) return void 0;
    return { ...invoice, id: invoice._id.toString() };
  }
  async deleteInvoice(id) {
    await Invoice.findByIdAndDelete(id);
  }
  // Payment operations
  async createPayment(payment) {
    const created = await Payment.create(payment);
    const doc = created.toObject();
    return { ...doc, id: doc._id.toString() };
  }
  async getPaymentsByUser(userId) {
    const payments = await Payment.find({ userId }).sort({ createdAt: -1 }).lean();
    return payments.map((pay) => ({ ...pay, id: pay._id.toString() }));
  }
  async updatePaymentStatus(id, status) {
    const payment = await Payment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean();
    if (!payment) throw new Error("Payment not found");
    return { ...payment, id: payment._id.toString() };
  }
};
var storage = new MongoDBStorage();

// server/routes.ts
import Razorpay from "razorpay";
import crypto from "crypto";
import { z } from "zod";
import { nanoid } from "nanoid";
var razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET ? new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
}) : null;
var invoiceSchema2 = z.object({
  userId: z.string(),
  invoiceNumber: z.string(),
  theme: z.string().default("default"),
  companyName: z.string(),
  companyTagline: z.string().optional(),
  logoUrl: z.string().optional(),
  clientName: z.string(),
  invoiceDate: z.string(),
  items: z.any(),
  // Array of invoice items
  totalAmount: z.number(),
  amountPaid: z.number().default(0),
  tax: z.string().default("0%"),
  address: z.string().optional(),
  phone: z.string().optional()
});
var isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "User is not authenticated" });
};
async function registerRoutes(app2) {
  app2.get("/api/invoices", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const invoices = await storage.getInvoicesByUser(userId);
      res.json(invoices);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  });
  const BASIC_THEMES = ["default", "blue", "green", "purple"];
  const PREMIUM_THEMES = ["slate", "ocean", "sunset", "mint", "lavender", "blush", "graphite", "seaside", "vibrant", "pastel", "rose", "lime"];
  function canAccessTheme(theme, user) {
    if (BASIC_THEMES.includes(theme)) return true;
    const hasActiveSubscription = user.subscriptionStatus === "active" && (user.subscriptionTier === "monthly" || user.subscriptionTier === "yearly");
    const hasCredits = (user.invoiceCredits || 0) > 0;
    return hasActiveSubscription || hasCredits;
  }
  app2.post("/api/invoices", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const hasActiveSubscription = user.subscriptionStatus === "active" && (user.subscriptionTier === "monthly" || user.subscriptionTier === "yearly");
      const hasCredits = (user.invoiceCredits || 0) > 0;
      const theme = req.body.theme || "default";
      if (!canAccessTheme(theme, user)) {
        return res.status(403).json({
          message: "Premium theme requires subscription or credit",
          requiredTier: "subscription or credit"
        });
      }
      if (!hasActiveSubscription && !hasCredits) {
        return res.status(403).json({
          message: "Invoice creation requires an active subscription or an invoice credit.",
          requiredTier: "subscription or credit"
        });
      }
      const invoiceData = invoiceSchema2.parse({
        ...req.body,
        userId,
        theme
      });
      const invoice = await storage.createInvoice(invoiceData);
      if (!hasActiveSubscription && hasCredits) {
        await storage.updateUser(userId, { invoiceCredits: user.invoiceCredits - 1 });
      }
      res.json(invoice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid invoice data", errors: error.errors });
      } else {
        console.error("Error creating invoice:", error);
        res.status(500).json({ message: "Failed to create invoice" });
      }
    }
  });
  app2.delete(
    "/api/invoices/:id",
    isAuthenticated,
    async (req, res) => {
      try {
        const userId = req.user.id;
        const invoiceId = req.params.id;
        const invoice = await storage.getInvoice(invoiceId);
        if (!invoice || invoice.userId !== userId) {
          return res.status(404).json({ message: "Invoice not found or you do not have permission to delete it" });
        }
        await storage.deleteInvoice(invoiceId);
        res.json({ message: "Invoice deleted successfully" });
      } catch (error) {
        console.error("Error deleting invoice:", error);
        res.status(500).json({ message: "Failed to delete invoice" });
      }
    }
  );
  const PLAN_PRICES = {
    single: 1900,
    // ₹19 in paise
    monthly: 39900,
    // ₹399 in paise
    yearly: 399900
    // ₹3999 in paise
  };
  app2.post(
    "/api/payment/create-order",
    isAuthenticated,
    async (req, res) => {
      try {
        if (!razorpay) {
          return res.status(503).json({ message: "Payment system not configured" });
        }
        const userId = req.user.id;
        const { plan } = req.body;
        if (!plan || !["monthly", "yearly", "single"].includes(plan)) {
          return res.status(400).json({ message: "Invalid plan" });
        }
        const amount = PLAN_PRICES[plan];
        const receiptId = `sub_${nanoid(12)}`;
        const order = await razorpay.orders.create({
          amount,
          currency: "INR",
          receipt: receiptId,
          notes: {
            userId,
            plan
          }
        });
        let paymentType2;
        if (plan === "monthly") {
          paymentType2 = "subscription_monthly";
        } else if (plan === "yearly") {
          paymentType2 = "subscription_yearly";
        } else {
          paymentType2 = "invoice";
        }
        await storage.createPayment({
          userId,
          razorpayOrderId: order.id,
          amount,
          currency: "INR",
          paymentType: paymentType2,
          // Sahi paymentType use hoga
          status: "pending"
        });
        console.log(`BACKEND: Creating payment in DB with type: ${paymentType2}`);
        res.json({
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          keyId: process.env.RAZORPAY_KEY_ID
        });
      } catch (error) {
        console.error("Error creating payment:", error);
        res.status(500).json({ message: "Error creating payment order: " + error.message, errorDetails: error });
      }
    }
  );
  app2.post(
    "/api/verify-payment",
    isAuthenticated,
    async (req, res) => {
      try {
        if (!razorpay) {
          return res.status(503).json({ message: "Payment system not configured" });
        }
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const userId = req.user.id;
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(sign.toString()).digest("hex");
        if (razorpay_signature === expectedSign) {
          const payments = await storage.getPaymentsByUser(userId);
          const payment = payments.find((p) => p.razorpayOrderId === razorpay_order_id);
          if (payment) {
            await storage.updatePaymentStatus(payment.id, "succeeded");
            console.log(`BACKEND: Creating payment in DB with type: ${paymentType}`);
            const endDate = /* @__PURE__ */ new Date();
            if (payment.paymentType === "subscription_monthly") {
              endDate.setMonth(endDate.getMonth() + 1);
              await storage.updateUserSubscription(userId, {
                subscriptionTier: "monthly",
                subscriptionStatus: "active",
                subscriptionEndsAt: endDate
              });
            } else if (payment.paymentType === "subscription_yearly") {
              endDate.setFullYear(endDate.getFullYear() + 1);
              await storage.updateUserSubscription(userId, {
                subscriptionTier: "yearly",
                subscriptionStatus: "active",
                subscriptionEndsAt: endDate
              });
            } else if (payment.paymentType === "invoice") {
              const user = await storage.getUser(userId);
              const currentCredits = user?.invoiceCredits || 0;
              await storage.updateUser(userId, {
                invoiceCredits: currentCredits + 1
              });
            }
            res.json({ success: true, message: "Payment verified and account updated" });
          } else {
            res.status(404).json({ message: "Payment record not found" });
          }
        } else {
          res.status(400).json({ message: "Invalid payment signature" });
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ message: "Error verifying payment: " + error.message });
      }
    }
  );
  app2.post("/api/razorpay-webhook", async (req, res) => {
    if (!razorpay) {
      return res.status(503).json({ message: "Payment system not configured" });
    }
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (webhookSecret) {
      const receivedSignature = req.headers["x-razorpay-signature"];
      const webhookBody = req.rawBody || JSON.stringify(req.body);
      const expectedSignature = crypto.createHmac("sha256", webhookSecret).update(webhookBody).digest("hex");
      if (receivedSignature !== expectedSignature) {
        console.error("Webhook signature verification failed");
        return res.status(400).send("Invalid signature");
      }
    }
    const event = req.body.event;
    console.log("Razorpay webhook event:", event);
    res.status(200).json({ status: "ok" });
  });
  return createServer(app2);
}

// server/routes/authRoutes.ts
import { Router } from "express";
import passport from "passport";
var router = Router();
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
router.get("/user", (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: "No user authenticated" });
  }
});
var authRoutes_default = router;

// server/routes/apiRoutes.ts
import { Router as Router2 } from "express";

// server/models/User.ts
import { Schema } from "mongoose";
import mongoose2 from "mongoose";
var UserSchema = new Schema({
  googleId: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatarUrl: { type: String },
  companyName: { type: String },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  settings: {
    aiSuggestionsEnabled: { type: Boolean, default: true },
    darkMode: { type: Boolean, default: false }
  },
  subscriptionStatus: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive"
  },
  subscriptionTier: {
    type: String,
    enum: ["monthly", "yearly"]
  },
  subscriptionEndsAt: {
    type: Date
  },
  // --- YEH ADD KIYA GAYA ---
  invoiceCredits: {
    type: Number,
    default: 0
  }
}, { timestamps: true });
var User2 = mongoose2.models.User || mongoose2.model("User", UserSchema);
var User_default = User2;

// server/routes/apiRoutes.ts
var router2 = Router2();
var isAuthenticated2 = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "User not authenticated" });
};
router2.put("/profile", isAuthenticated2, async (req, res) => {
  try {
    const { name, companyName } = req.body;
    const userId = req.user.id;
    if (!name || !companyName) {
      return res.status(400).json({ message: "Name and Company Name are required." });
    }
    const updatedUser = await User_default.findByIdAndUpdate(
      userId,
      { $set: { name, companyName } },
      { new: true }
      // Yeh option update hone ke baad naya user data return karta hai
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "Profile updated successfully!", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error while updating profile" });
  }
});
router2.put("/settings", isAuthenticated2, async (req, res) => {
  try {
    const { aiSuggestionsEnabled, darkMode } = req.body;
    const userId = req.user.id;
    const settingsToUpdate = {};
    if (aiSuggestionsEnabled !== void 0) {
      settingsToUpdate["settings.aiSuggestionsEnabled"] = aiSuggestionsEnabled;
    }
    if (darkMode !== void 0) {
      settingsToUpdate["settings.darkMode"] = darkMode;
    }
    if (Object.keys(settingsToUpdate).length === 0) {
      return res.status(400).json({ message: "No settings provided to update." });
    }
    const updatedUser = await User_default.findByIdAndUpdate(
      userId,
      { $set: settingsToUpdate },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "Settings updated successfully!", settings: updatedUser.settings });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ message: "Server error while updating settings" });
  }
});
var apiRoutes_default = router2;

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid as nanoid2 } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid2()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/config/passport-setup.ts
import passport2 from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
passport2.serializeUser((user, done) => {
  done(null, user.id);
});
passport2.deserializeUser(async (id, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
passport2.use(
  new GoogleStrategy(
    {
      // Options for the Google strategy
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await storage.getUser(profile.id);
        if (existingUser) {
          console.log("Existing user found:", existingUser.name);
          done(null, existingUser);
        } else {
          const newUser = await storage.createUser({
            id: profile.id,
            // Use the Google profile ID as our user ID
            name: profile.displayName,
            email: profile.emails ? profile.emails[0].value : "",
            avatarUrl: profile.photos ? profile.photos[0].value : "",
            // Set default values for new users
            subscriptionStatus: "inactive",
            subscriptionTier: "free",
            subscriptionEndsAt: null
          });
          console.log("New user created:", newUser.name);
          done(null, newUser);
        }
      } catch (error) {
        done(error, void 0);
      }
    }
  )
);

// server/index.ts
var app = express2();
connectDB().catch((err) => {
  console.error("Failed to connect to MongoDB:", err);
  process.exit(1);
});
app.use("/api/razorpay-webhook", express2.raw({ type: "application/json" }));
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    // Secret key to sign the session ID cookie
    resave: false,
    // Don't save session if unmodified
    saveUninitialized: false,
    // Don't create session until something stored
    cookie: {
      maxAge: 24 * 60 * 60 * 1e3
      // Session cookie expires in 24 hours
    }
  })
);
app.use(passport3.initialize());
app.use(passport3.session());
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api") || path3.startsWith("/auth")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  app.use("/auth", authRoutes_default);
  app.use("/api", apiRoutes_default);
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    console.error(err);
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0"
  }, () => {
    log(`serving on port ${port}`);
  });
})();
