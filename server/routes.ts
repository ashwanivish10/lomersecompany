



import { createServer, type Server } from "http";
import { storage } from "./storage";
import Razorpay from "razorpay";
import crypto from "crypto";
import { z } from "zod";
import { nanoid } from "nanoid"; // Import nanoid to generate short IDs


  

// Initialize Razorpay only if keys are available
const razorpay =
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
      })
    : null;

// Extend Express Request type to include user, compatible with Passport.js
interface AuthRequest extends Request {
  user?: {
    id: string; // Standard user ID property from Passport
    invoiceCredits?: number; 
    [key: string]: any;
  };
}

// Invoice validation schema
const invoiceSchema = z.object({
  userId: z.string(),
  invoiceNumber: z.string(),
  theme: z.string().default("default"),
  companyName: z.string(),
  companyTagline: z.string().optional(),
  logoUrl: z.string().optional(),
  clientName: z.string(),
  invoiceDate: z.string(),
  items: z.any(), // Array of invoice items
  totalAmount: z.number(),
  amountPaid: z.number().default(0),
  tax: z.string().default("0%"),
  address: z.string().optional(),
  phone: z.string().optional(),
});

/**
 * Middleware to check if the user is authenticated via Passport.js session.
 */
const isAuthenticated = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // req.isAuthenticated() is the primary method provided by Passport
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  // If not authenticated, deny access.
  res.status(401).json({ message: "User is not authenticated" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all invoices for user (Protected)
  app.get("/api/invoices", isAuthenticated, async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.id; // We know req.user exists because of isAuthenticated
      const invoices = await storage.getInvoicesByUser(userId);
      res.json(invoices);
  } catch (error) {
      console.error("Error fetching invoices:", error);
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  });

  // Theme access control - server-side validation
  const BASIC_THEMES = ["default", "blue", "green", "purple"];
  const PREMIUM_THEMES = ['slate', 'ocean', 'sunset', 'mint', 'lavender', 'blush', 'graphite', 'seaside', 'vibrant', 'pastel', 'rose', 'lime'];

  // --- YEH HAI UPDATE: Premium themes ko credits ke liye bhi unlock kiya gaya ---
  function canAccessTheme(theme: string, user: any): boolean {
    if (BASIC_THEMES.includes(theme)) return true; // Basic themes hamesha free hain

    // Check 1: Monthly/Yearly "Pro" subscription
    const hasActiveSubscription =
      user.subscriptionStatus === "active" &&
      (user.subscriptionTier === "monthly" ||
        user.subscriptionTier === "yearly");

    // Check 2: User ke paas single invoice credit hai (₹19 plan se)
    const hasCredits = (user.invoiceCredits || 0) > 0;

    // Premium themes tabhi allowed hain jab Pro sub ho YA credit ho
    return hasActiveSubscription || hasCredits;
  }
  // --- UPDATE ENDS ---

  // Create new invoice (Protected)
  app.post("/api/invoices", isAuthenticated, async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.id;
      const user = await storage.getUser(userId);

      if (!user) {
      return res.status(404).json({ message: "User not found" });
      }

      const hasActiveSubscription =
        user.subscriptionStatus === "active" &&
        (user.subscriptionTier === "monthly" || user.subscriptionTier === "yearly");
      const hasCredits = (user.invoiceCredits || 0) > 0;

      // 1. Theme check (Yeh ab naya canAccessTheme function use karega)
      const theme = req.body.theme || "default";
      if (!canAccessTheme(theme, user)) {
        return res.status(403).json({
        message: "Premium theme requires subscription or credit",
        requiredTier: "subscription or credit",
        });
      }

      // 2. Creation check (Yeh pehle se hi credits check kar raha tha)
      if (!hasActiveSubscription && !hasCredits) {
        return res.status(403).json({
          message: "Invoice creation requires an active subscription or an invoice credit.",
          requiredTier: "subscription or credit",
        });
      }

      const invoiceData = invoiceSchema.parse({
      ...req.body,
      userId,
      theme,
      });

      const invoice = await storage.createInvoice(invoiceData);

      // Agar credit use kiya hai, toh usse kam karna
      if (!hasActiveSubscription && hasCredits) {
        await storage.updateUser(userId, { invoiceCredits: user.invoiceCredits - 1 });
      }

      res.json(invoice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res
        .status(400)
        .json({ message: "Invalid invoice data", errors: error.errors });
      } else {
        console.error("Error creating invoice:", error);
        res.status(500).json({ message: "Failed to create invoice" });
      }
    }
  });

  // Delete invoice (Protected)
  app.delete( "/api/invoices/:id", isAuthenticated, async (req: AuthRequest, res) => {
      try {
      const userId = req.user!.id;
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
    single: 1900,  // ₹19 in paise
    monthly: 39900, // ₹399 in paise
    yearly: 399900, // ₹3999 in paise
  };

  // Create Razorpay order (Protected)
  app.post("/api/payment/create-order", isAuthenticated, async (req: AuthRequest, res) => {
      try {
      if (!razorpay) {
        return res.status(503).json({ message: "Payment system not configured" });
      }

      const userId = req.user!.id;
      const { plan } = req.body;

      if (!plan || !["monthly", "yearly", "single"].includes(plan)) {
        return res.status(400).json({ message: "Invalid plan" });
      }
      
      const amount = PLAN_PRICES[plan as "monthly" | "yearly" | "single"];

      const receiptId = `sub_${nanoid(12)}`;

      const order = await razorpay.orders.create({
        amount,
        currency: "INR",
        receipt: receiptId, 
        notes: {
        userId,
        plan,
        },
      });

        let paymentType: string;
        if (plan === 'monthly') {
          paymentType = 'subscription_monthly';
        } else if (plan === 'yearly') {
          paymentType = 'subscription_yearly';
        } else {
          paymentType = 'invoice'; // 'single_invoice' se 'invoice' kar diya
        }

      await storage.createPayment({
        userId,
        razorpayOrderId: order.id,
        amount,
        currency: "INR",
        paymentType: paymentType, // Sahi paymentType use hoga
        status: "pending",
      });


      res.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID, 
      });
      } catch (error: any) {
      console.error("Error creating payment:", error);
      res.status(500).json({ message: "Error creating payment order: " + error.message, errorDetails: error });
      }
    }
  );

  // Verify Razorpay payment (Protected)
  app.post("/api/verify-payment", isAuthenticated, async (req: AuthRequest, res) => {
      try {
      if (!razorpay) {
        return res.status(503).json({ message: "Payment system not configured" });
      }

      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      const userId = req.user!.id;

      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(sign.toString())
        .digest("hex");

      if (razorpay_signature === expectedSign) {
        const payments = await storage.getPaymentsByUser(userId);
        const payment = payments.find(p => p.razorpayOrderId === razorpay_order_id);

       if (payment) {
        await storage.updatePaymentStatus(payment.id, "succeeded");
console.log(`BACKEND: Payment verified. Type is: ${payment.paymentType}`);

      const endDate = new Date();
            
        if (payment.paymentType === "subscription_monthly") {
          endDate.setMonth(endDate.getMonth() + 1);
              await storage.updateUserSubscription(userId, {
            subscriptionTier: "monthly",
            subscriptionStatus: "active",
            subscriptionEndsAt: endDate,
          });
        } else if (payment.paymentType === "subscription_yearly") {
          endDate.setFullYear(endDate.getFullYear() + 1);
              await storage.updateUserSubscription(userId, {
         subscriptionTier: "yearly",
            subscriptionStatus: "active",
            subscriptionEndsAt: endDate,
          });
          
        } else if (payment.paymentType === "invoice") { // 'single_invoice' se 'invoice' kar diya
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
      } catch (error: any) {
      console.error("Error verifying payment:", error);
      res.status(500).json({ message: "Error verifying payment: " + error.message });
     }
    }
  );

  // Razorpay webhook handler (Public, secured by signature)
  app.post("/api/razorpay-webhook", async (req, res) => {
    if (!razorpay) {
      return res.status(503).json({ message: "Payment system not configured" });
    }

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  
    if (webhookSecret) {
      const receivedSignature = req.headers['x-razorpay-signature'];
    
      const webhookBody = (req as any).rawBody || JSON.stringify(req.body);

      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(webhookBody)
        .digest('hex');

      if (receivedSignature !== expectedSignature) {
      console.error('Webhook signature verification failed');
      return res.status(400).send('Invalid signature');
      }
    }

    const event = req.body.event;
    console.log('Razorpay webhook event:', event);
    
    // Logic to handle webhook events would go here

    res.status(200).json({ status: 'ok' });
});

  return createServer(app);
}

