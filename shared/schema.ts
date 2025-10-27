import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  // Stripe fields for payment integration
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  // Subscription status
  subscriptionTier: varchar("subscription_tier").default('free'), // 'free', 'monthly', 'yearly'
  subscriptionStatus: varchar("subscription_status").default('inactive'), // 'active', 'inactive', 'canceled'
  subscriptionEndsAt: timestamp("subscription_ends_at"),
  // Credits for pay-per-invoice (in paise for accuracy)
  invoiceCredits: integer("invoice_credits").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Invoices table
export const invoices = pgTable("invoices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  invoiceNumber: varchar("invoice_number").notNull(),
  theme: varchar("theme").notNull().default('default'), // Theme name used
  // Invoice content as JSON
  companyName: varchar("company_name").notNull(),
  companyTagline: varchar("company_tagline"),
  logoUrl: varchar("logo_url"),
  clientName: varchar("client_name").notNull(),
  invoiceDate: varchar("invoice_date").notNull(),
  items: jsonb("items").notNull(), // Array of invoice items
  totalAmount: integer("total_amount").notNull(), // In paise
  amountPaid: integer("amount_paid").default(0),
  tax: varchar("tax").default('0%'),
  address: text("address"),
  phone: varchar("phone"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const invoicesRelations = relations(invoices, ({ one }) => ({
  user: one(users, {
    fields: [invoices.userId],
    references: [users.id],
  }),
}));

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type Invoice = typeof invoices.$inferSelect;

// Payments/Transactions table
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  stripePaymentIntentId: varchar("stripe_payment_intent_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  amount: integer("amount").notNull(), // In paise
  currency: varchar("currency").default('inr'),
  paymentType: varchar("payment_type").notNull(), // 'invoice', 'subscription_monthly', 'subscription_yearly'
  status: varchar("status").notNull(), // 'pending', 'succeeded', 'failed'
  createdAt: timestamp("created_at").defaultNow(),
});

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
}));

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
});

export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;
