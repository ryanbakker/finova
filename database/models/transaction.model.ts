import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  userId: string;
  date: Date;
  amount: number;
  type: "income" | "expense" | "transfer";
  category: {
    name: string;
    icon: string;
  };
  description: string;
  merchant?: string;
  accountId: string;
  accountName: string;
  isRecurring: boolean;
  recurringId?: string;
  tags: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["income", "expense", "transfer"],
      required: true,
    },
    category: {
      name: {
        type: String,
        required: true,
      },
      icon: {
        type: String,
        required: true,
      },
    },
    description: {
      type: String,
      required: true,
    },
    merchant: {
      type: String,
      required: false,
    },
    accountId: {
      type: String,
      required: true,
      index: true,
    },
    accountName: {
      type: String,
      required: true,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringId: {
      type: String,
      required: false,
      index: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    notes: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    collection: "transactions",
  }
);

// Indexes for better query performance
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, "category.name": 1 });
transactionSchema.index({ userId: 1, type: 1 });
transactionSchema.index({ userId: 1, accountId: 1 });

export const Transaction =
  mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", transactionSchema);
