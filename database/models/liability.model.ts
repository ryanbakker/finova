import mongoose, { Schema, Document } from 'mongoose';

export interface ILiability extends Document {
    userId: string;
    name: string;
    category: string;
    amount: number;
    currency: string;
    institution?: string;
    accountNumber?: string;
    dueDate?: Date;
    interestRate?: number;
    monthlyPayment?: number;
    remainingBalance?: number;
    originalAmount?: number;
    notes?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const liabilitySchema = new Schema<ILiability>({
    userId: {
        type: String,
        required: [true, 'User ID is required'],
        index: true,
        trim: true
    },
    name: {
        type: String,
        required: [true, 'Liability name is required'],
        trim: true,
        minlength: [1, 'Liability name must be at least 1 character long'],
        maxlength: [100, 'Liability name cannot exceed 100 characters']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true,
        minlength: [1, 'Category must be at least 1 character long'],
        maxlength: [50, 'Category cannot exceed 50 characters']
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0, 'Amount must be non-negative'],
        max: [999999999, 'Amount cannot exceed 999,999,999']
    },
    currency: {
        type: String,
        required: [true, 'Currency is required'],
        default: 'USD',
        trim: true,
        uppercase: true,
        minlength: [3, 'Currency must be at least 3 characters'],
        maxlength: [3, 'Currency must be exactly 3 characters']
    },
    institution: {
        type: String,
        required: false,
        trim: true,
        maxlength: [100, 'Institution name cannot exceed 100 characters']
    },
    accountNumber: {
        type: String,
        required: false,
        trim: true,
        maxlength: [50, 'Account number cannot exceed 50 characters']
    },
    dueDate: {
        type: Date,
        required: false,
        validate: {
            validator: function(value: Date) {
                if (!value) return true; // Optional field
                const now = new Date();
                const maxDate = new Date(now.getFullYear() + 30, now.getMonth(), now.getDate()); // 30 years in future
                return value >= now;
            },
            message: 'Due date cannot be in the past'
        }
    },
    interestRate: {
        type: Number,
        required: false,
        min: [0, 'Interest rate must be non-negative'],
        max: [100, 'Interest rate cannot exceed 100%'],
        validate: {
            validator: function(value: number) {
                if (value === undefined || value === null) return true; // Optional field
                return value >= 0 && value <= 100;
            },
            message: 'Interest rate must be between 0% and 100%'
        }
    },
    monthlyPayment: {
        type: Number,
        required: false,
        min: [0, 'Monthly payment must be non-negative'],
        max: [999999999, 'Monthly payment cannot exceed 999,999,999'],
        validate: {
            validator: function(value: number) {
                if (value === undefined || value === null) return true; // Optional field
                return value >= 0;
            },
            message: 'Monthly payment must be non-negative'
        }
    },
    remainingBalance: {
        type: Number,
        required: false,
        min: [0, 'Remaining balance must be non-negative'],
        max: [999999999, 'Remaining balance cannot exceed 999,999,999'],
        validate: {
            validator: function(value: number) {
                if (value === undefined || value === null) return true; // Optional field
                return value >= 0;
            },
            message: 'Remaining balance must be non-negative'
        }
    },
    originalAmount: {
        type: Number,
        required: false,
        min: [0, 'Original amount must be non-negative'],
        max: [999999999, 'Original amount cannot exceed 999,999,999'],
        validate: {
            validator: function(value: number) {
                if (value === undefined || value === null) return true; // Optional field
                return value >= 0;
            },
            message: 'Original amount must be non-negative'
        }
    },
    notes: {
        type: String,
        required: false,
        trim: true,
        maxlength: [500, 'Notes cannot exceed 500 characters']
    },
    isActive: {
        type: Boolean,
        required: [true, 'Active status is required'],
        default: true
    }
}, {
    timestamps: true
});

// Compound index for efficient queries
liabilitySchema.index({ userId: 1, category: 1 });
liabilitySchema.index({ userId: 1, isActive: 1 });
liabilitySchema.index({ userId: 1, dueDate: 1 });

// Pre-save middleware to set default values
liabilitySchema.pre('save', function(next) {
    // Set remaining balance to amount if not provided
    if (this.remainingBalance === undefined || this.remainingBalance === null) {
        this.remainingBalance = this.amount;
    }
    
    // Set original amount to amount if not provided
    if (this.originalAmount === undefined || this.originalAmount === null) {
        this.originalAmount = this.amount;
    }
    
    next();
});

// Virtual for calculating total interest paid
liabilitySchema.virtual('totalInterestPaid').get(function() {
    if (this.originalAmount && this.remainingBalance) {
        return Math.max(0, this.originalAmount - this.remainingBalance);
    }
    return 0;
});

// Virtual for calculating progress percentage
liabilitySchema.virtual('progressPercentage').get(function() {
    if (this.originalAmount && this.remainingBalance) {
        const paid = this.originalAmount - this.remainingBalance;
        return Math.min(100, Math.max(0, (paid / this.originalAmount) * 100));
    }
    return 0;
});

// Ensure virtual fields are serialized
liabilitySchema.set('toJSON', { virtuals: true });
liabilitySchema.set('toObject', { virtuals: true });

const Liability = mongoose.models.Liability || mongoose.model<ILiability>('Liability', liabilitySchema);

export default Liability;
