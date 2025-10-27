// import { Schema, model, Document } from 'mongoose';
// import mongoose from "mongoose";
// // User settings ke liye ek interface
// interface IUserSettings {
//   aiSuggestionsEnabled: boolean;
//   darkMode: boolean;
// }

// // User document ke liye ek interface
// export interface IUser extends Document {
//   googleId?: string; // Google se login karne par
//   name: string;
//   email: string;
//   avatarUrl?: string;
//   companyName?: string;
//   role: 'user' | 'admin';
//   settings: IUserSettings;
//   subscriptionStatus?: 'active' | 'inactive';
//   subscriptionTier?: 'monthly' | 'yearly';
//   subscriptionEndsAt?: Date;
// }

// // User ka Schema
// const UserSchema = new Schema<IUser>({
//   googleId: { type: String },
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   avatarUrl: { type: String },
//   companyName: { type: String },
//   role: {
//     type: String,
//     enum: ['user', 'admin'],
//     default: 'user',
//   },
//   settings: {
//     aiSuggestionsEnabled: { type: Boolean, default: true },
//     darkMode: { type: Boolean, default: false },
//   },
//   subscriptionStatus: {
//     type: String,
//     enum: ['active', 'inactive'],
//     default: 'inactive',
//   },
//   subscriptionTier: {
//     type: String,
//     enum: ['monthly', 'yearly'],
//   },
//   subscriptionEndsAt: {
//     type: Date,
//   },

// }, { timestamps: true }); // `createdAt` aur `updatedAt` fields a-apne aap add ho jaayengi

// // Model ko export karein
// const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
// export default User;


import { Schema, model, Document } from 'mongoose';
import mongoose from "mongoose";

// User settings ke liye ek interface
interface IUserSettings {
  aiSuggestionsEnabled: boolean;
  darkMode: boolean;
}

// User document ke liye ek interface
export interface IUser extends Document {
  googleId?: string; // Google se login karne par
  name: string;
  email: string;
  avatarUrl?: string;
  companyName?: string;
  role: 'user' | 'admin';
  settings: IUserSettings;
  subscriptionStatus?: 'active' | 'inactive';
  subscriptionTier?: 'monthly' | 'yearly' ;
  subscriptionEndsAt?: Date;
  invoiceCredits?: number; // --- YEH ADD KIYA GAYA ---
}

// User ka Schema
const UserSchema = new Schema<IUser>({
  googleId: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatarUrl: { type: String },
  companyName: { type: String },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  settings: {
    aiSuggestionsEnabled: { type: Boolean, default: true },
    darkMode: { type: Boolean, default: false },
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive',
  },
  subscriptionTier: {
    type: String,
    enum: ['monthly', 'yearly'],
  },
  subscriptionEndsAt: {
    type: Date,
  },
  // --- YEH ADD KIYA GAYA ---
  invoiceCredits: {
    type: Number,
    default: 0,
  },

}, { timestamps: true }); // `createdAt` aur `updatedAt` fields a-apne aap add ho jaayengi

// Model ko export karein
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;