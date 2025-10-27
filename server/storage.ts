// 

// MongoDB storage implementation
import { User, Invoice, Payment } from "./models";
import { IUser } from "./models/User"; // --- YEH IMPORT ADD KIYA ---

export interface IStorage {
  // User operations
  getUser(id: string): Promise<any | undefined>;
  upsertUser(user: any): Promise<any>;
  createUser(user: any): Promise<any>;
  updateUserSubscription(
    id: string,
    data: {
      razorpayCustomerId?: string;
      razorpaySubscriptionId?: string;
      subscriptionTier?: string;
      subscriptionStatus?: string;
      subscriptionEndsAt?: Date;
    }
  ): Promise<any>;
  
  // --- YEH FUNCTION INTERFACE MEIN ADD KIYA ---
  updateUser(id: string, updates: Partial<IUser>): Promise<any>;

  // Invoice operations
  createInvoice(invoice: any): Promise<any>;
  getInvoicesByUser(userId: string): Promise<any[]>;
  getInvoice(id: string): Promise<any | undefined>;
  deleteInvoice(id: string): Promise<void>;

  // Payment operations
  createPayment(payment: any): Promise<any>;
  getPaymentsByUser(userId: string): Promise<any[]>;
  updatePaymentStatus(id: string, status: string): Promise<any>;
}

export class MongoDBStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<any | undefined> {
    // ... (aapka getUser function jaisa tha waisa hi)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        const userByGoogleId = await User.findOne({ _id: id }).lean();
        if (!userByGoogleId) return undefined;
        return { ...userByGoogleId, id: userByGoogleId._id };
    }
    const user = await User.findById(id).lean();
    if (!user) return undefined;
    return { ...user, id: user._id };
  }

  async upsertUser(userData: any): Promise<any> {
    // ... (aapka upsertUser function jaisa tha waisa hi)
    const user = await User.findByIdAndUpdate(
      userData.id,
      userData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();
    return { ...user, id: user!._id };
  }

  async createUser(userData: any): Promise<any> {
    // ... (aapka createUser function jaisa tha waisa hi)
    const userToCreate = {
        ...userData,
        _id: userData.id
    };
    const created = await User.create(userToCreate);
    const doc = created.toObject();
    return { ...doc, id: doc._id };
  }

  async updateUserSubscription(
    id: string,
    data: {
      // ... (data jaisa tha waisa hi)
      razorpayCustomerId?: string;
      razorpaySubscriptionId?: string;
      subscriptionTier?: string;
      subscriptionStatus?: string;
      subscriptionEndsAt?: Date;
    }
  ): Promise<any> {
    const user = await User.findByIdAndUpdate(
      id,
      data,
      { new: true }
    ).lean();
    if (!user) throw new Error('User not found');
    return { ...user, id: user._id };
  }

  // --- YEH NAYA FUNCTION CLASS MEIN ADD KIYA ---
  async updateUser(id: string, updates: Partial<IUser>): Promise<any> {
    try {
      const user = await User.findByIdAndUpdate(
        id,
        { $set: updates }, // $set use karein taaki poora document replace na ho
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
  async createInvoice(invoice: any): Promise<any> {
    const created = await Invoice.create(invoice);
    const doc = created.toObject();
    return { ...doc, id: doc._id.toString() };
  }

  async getInvoicesByUser(userId: string): Promise<any[]> {
    const invoices = await Invoice.find({ userId })
      .sort({ createdAt: -1 })
  	  .lean();
  return invoices.map(inv => ({ ...inv, id: inv._id.toString() }));
  }

  async getInvoice(id: string): Promise<any | undefined> {
    const invoice = await Invoice.findById(id).lean();
    if (!invoice) return undefined;
    return { ...invoice, id: invoice._id.toString() };
  }

  async deleteInvoice(id: string): Promise<void> {
    await Invoice.findByIdAndDelete(id);
  }

  // Payment operations
  async createPayment(payment: any): Promise<any> {
    const created = await Payment.create(payment);
    const doc = created.toObject();
    return { ...doc, id: doc._id.toString() };
  }

  async getPaymentsByUser(userId: string): Promise<any[]> {
    const payments = await Payment.find({ userId })
  	  .sort({ createdAt: -1 })
  	  .lean();
    return payments.map(pay => ({ ...pay, id: pay._id.toString() }));
  }

  async updatePaymentStatus(id: string, status: string): Promise<any> {
    const payment = await Payment.findByIdAndUpdate(
  	  id,
  	  { status },
  	  { new: true }
    ).lean();
    if (!payment) throw new Error('Payment not found');
    return { ...payment, id: payment._id.toString() };
  }
}

export const storage = new MongoDBStorage();