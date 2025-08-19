import mongoose, { Schema, Document } from 'mongoose';

export interface IBudget extends Document {
    userId: string;
    category: string;
    amount: number;
    spent: number;
    currency: string;
    period: 'monthly' | 'quarterly' | 'yearly';
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const budgetSchema = new Schema<IBudget>({
    userId: {
        type: String,
        required: true,
        index: true
    },
    category: {
        type: String,
        required: true,
        index: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    spent: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    currency: {
        type: String,
        required: true,
        default: 'USD'
    },
    period: {
        type: String,
        enum: ['monthly', 'quarterly', 'yearly'],
        required: true,
        default: 'monthly'
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    collection: 'budgets'
});

// Indexes for better query performance
budgetSchema.index({ userId: 1, category: 1 });
budgetSchema.index({ userId: 1, period: 1 });
budgetSchema.index({ userId: 1, startDate: -1 });
budgetSchema.index({ userId: 1, isActive: 1 });

// Compound index for user and date range queries
budgetSchema.index({ userId: 1, startDate: 1, endDate: 1 });

export const Budget = mongoose.model<IBudget>('Budget', budgetSchema);
