import { Schema, model, Document, Types } from 'mongoose';
import mongoose from "mongoose";

export interface IPayment extends Document {
  userId: string; // <-- ObjectId se String kar diya
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  amount: number; // Amount in paise
  currency: string;
  paymentType: 'subscription_monthly' | 'subscription_yearly' | 'single_invoice';
  status: 'pending' | 'succeeded' | 'failed';
}

const PaymentSchema = new Schema<IPayment>({
  userId: {
    type: String, // <-- YEH HAI FIX: ObjectId se String kar diya
    ref: 'User',
    required: true,
  },
  razorpayOrderId: {
    type: String,
    required: true,
  	// unique: true, // <-- Ise hata diya taaki failed payment retry ho sakein
  },
  razorpayPaymentId: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  paymentType: {
    type: String,
    enum: ['subscription_monthly', 'subscription_yearly', 'single_invoice'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'succeeded', 'failed'],
    default: 'pending',
  },
}, { timestamps: true });

const Payment = mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
export default Payment;

