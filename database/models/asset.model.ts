import mongoose, { Schema, Document } from 'mongoose';

export interface IAsset extends Document {
    userId: string;
    name: string;
    category: string;
    value: number;
    currency: string;
    institution?: string;
    accountNumber?: string;
    purchaseDate?: Date;
    currentValue?: number;
    changeAmount?: number;
    changePercentage?: number;
    notes?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const assetSchema = new Schema<IAsset>({
    userId: {
        type: String,
        required: [true, 'User ID is required'],
        index: true,
        trim: true
    },
    name: {
        type: String,
        required: [true, 'Asset name is required'],
        trim: true,
        minlength: [1, 'Asset name must be at least 1 character long'],
        maxlength: [100, 'Asset name cannot exceed 100 characters']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true,
        minlength: [1, 'Category must be at least 1 character long'],
        maxlength: [50, 'Category cannot exceed 50 characters']
    },
    value: {
        type: Number,
        required: [true, 'Value is required'],
        min: [0, 'Value must be non-negative'],
        max: [999999999, 'Value cannot exceed 999,999,999']
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
    purchaseDate: {
        type: Date,
        required: false,
        validate: {
            validator: function(value: Date) {
                if (!value) return true; // Optional field
                const now = new Date();
                const maxDate = new Date(now.getFullYear() + 10, now.getMonth(), now.getDate()); // 10 years in future
                return value <= maxDate;
            },
            message: 'Purchase date cannot be more than 10 years in the future'
        }
    },
    currentValue: {
        type: Number,
        required: false,
        min: [0, 'Current value must be non-negative'],
        max: [999999999, 'Current value cannot exceed 999,999,999'],
        validate: {
            validator: function(value: number) {
                if (value === undefined || value === null) return true; // Optional field
                return value >= 0;
            },
            message: 'Current value must be non-negative'
        }
    },
    changeAmount: {
        type: Number,
        required: false,
        default: 0,
        min: [-999999999, 'Change amount cannot be less than -999,999,999'],
        max: [999999999, 'Change amount cannot exceed 999,999,999']
    },
    changePercentage: {
        type: Number,
        required: false,
        default: 0,
        min: [-100, 'Change percentage cannot be less than -100%'],
        max: [1000, 'Change percentage cannot exceed 1000%']
    },
    notes: {
        type: String,
        required: false,
        trim: true,
        maxlength: [1000, 'Notes cannot exceed 1000 characters']
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    collection: 'assets',
    toJSON: {
        transform: function(doc, ret) {
            // Ensure _id is converted to string for JSON serialization
            if (ret._id) {
                ret.id = ret._id.toString();
                delete ret._id;
            }
            // Ensure userId is included in response
            if (ret.userId) {
                ret.userId = ret.userId.toString();
            }
            return ret;
        }
    }
});

// Pre-save middleware for data sanitization
assetSchema.pre('save', function(next) {
    // Sanitize string fields
    if (this.name) this.name = this.name.trim();
    if (this.category) this.category = this.category.trim();
    if (this.institution) this.institution = this.institution.trim();
    if (this.accountNumber) this.accountNumber = this.accountNumber.trim();
    if (this.notes) this.notes = this.notes.trim();
    
    // Ensure currency is uppercase
    if (this.currency) this.currency = this.currency.toUpperCase();
    
    // Set currentValue to value if not provided
    if (this.currentValue === undefined || this.currentValue === null) {
        this.currentValue = this.value;
    }
    
    // Calculate changeAmount and changePercentage if not provided
    if (this.changeAmount === undefined || this.changeAmount === null) {
        this.changeAmount = (this.currentValue || this.value) - this.value;
    }
    
    if (this.changePercentage === undefined || this.changePercentage === null) {
        this.changePercentage = this.value > 0 ? (this.changeAmount / this.value) * 100 : 0;
    }
    
    next();
});

// Pre-update middleware for data sanitization
assetSchema.pre(['updateOne', 'findOneAndUpdate', 'updateMany'], function(next) {
    const update = this.getUpdate() as any;
    
    // Sanitize string fields in updates
    if (update.name) update.name = update.name.trim();
    if (update.category) update.category = update.category.trim();
    if (update.institution) update.institution = update.institution.trim();
    if (update.accountNumber) update.accountNumber = update.accountNumber.trim();
    if (update.notes) update.notes = update.notes.trim();
    
    // Ensure currency is uppercase
    if (update.currency) update.currency = update.currency.toUpperCase();
    
    next();
});

// Indexes for better query performance and security
assetSchema.index({ userId: 1, category: 1 });
assetSchema.index({ userId: 1, isActive: 1 });
assetSchema.index({ userId: 1, createdAt: -1 });
assetSchema.index({ userId: 1, value: -1 });
assetSchema.index({ userId: 1, currentValue: -1 });
assetSchema.index({ userId: 1, institution: 1 });

// Compound index for efficient filtering and sorting
assetSchema.index({ userId: 1, isActive: 1, category: 1, createdAt: -1 });

// Text index for search functionality (if needed in the future)
// assetSchema.index({ name: 'text', category: 'text', notes: 'text' });

// Virtual for formatted value display
assetSchema.virtual('formattedValue').get(function() {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: this.currency || 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(this.value);
});

// Virtual for formatted current value display
assetSchema.virtual('formattedCurrentValue').get(function() {
    const value = this.currentValue || this.value;
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: this.currency || 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(value);
});

// Virtual for total return
assetSchema.virtual('totalReturn').get(function() {
    return this.currentValue ? this.currentValue - this.value : 0;
});

// Virtual for total return percentage
assetSchema.virtual('totalReturnPercentage').get(function() {
    if (this.value === 0) return 0;
    return this.currentValue ? ((this.currentValue - this.value) / this.value) * 100 : 0;
});

// Ensure virtuals are included when converting to JSON
assetSchema.set('toJSON', { virtuals: true });
assetSchema.set('toObject', { virtuals: true });

export const Asset = mongoose.model<IAsset>('Asset', assetSchema);
