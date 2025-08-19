import mongoose, { Schema, Document } from "mongoose";

export interface IBill extends Document {
  userId: string;
  name: string;
  amount: number;
  dueDate: Date;
  category: string;
  isRecurring: boolean;
  status: "paid" | "unpaid" | "overdue";
  frequency?: "monthly" | "quarterly" | "yearly" | "weekly";
  accountId?: string;
  accountName?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const billSchema = new Schema<IBill>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["paid", "unpaid", "overdue"],
      default: "unpaid",
    },
    frequency: {
      type: String,
      enum: ["monthly", "quarterly", "yearly", "weekly"],
      required: false,
    },
    accountId: {
      type: String,
      required: false,
      index: true,
    },
    accountName: {
      type: String,
      required: false,
    },
    notes: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    collection: "bills",
  }
);

// Indexes for better query performance
billSchema.index({ userId: 1, dueDate: 1 });
billSchema.index({ userId: 1, category: 1 });
billSchema.index({ userId: 1, status: 1 });
billSchema.index({ userId: 1, isRecurring: 1 });

export const Bill = mongoose.model<IBill>("Bill", billSchema);
