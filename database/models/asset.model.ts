import mongoose, { Schema, Document } from "mongoose";

export interface IAsset extends Document {
  userId: string;
  name: string;
  category: string;
  currentValue: number;
  changeAmount: number;
  changePercentage: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const assetSchema = new Schema<IAsset>(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      index: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Asset name is required"],
      trim: true,
      minlength: [1, "Asset name must be at least 1 character long"],
      maxlength: [100, "Asset name cannot exceed 100 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      minlength: [1, "Category must be at least 1 character long"],
      maxlength: [50, "Category cannot exceed 50 characters"],
    },
    currentValue: {
      type: Number,
      required: [true, "Current value is required"],
      min: [0, "Current value must be non-negative"],
      max: [999999999, "Current value cannot exceed 999,999,999"],
    },
    changeAmount: {
      type: Number,
      required: [true, "Change amount is required"],
      default: 0,
      min: [-999999999, "Change amount cannot be less than -999,999,999"],
      max: [999999999, "Change amount cannot exceed 999,999,999"],
    },
    changePercentage: {
      type: Number,
      required: [true, "Change percentage is required"],
      default: 0,
      min: [-100, "Change percentage cannot be less than -100%"],
      max: [1000, "Change percentage cannot exceed 1000%"],
    },
    description: {
      type: String,
      required: false,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
  },
  {
    timestamps: true,
    collection: "assets",
    toJSON: {
      transform: function (doc, ret) {
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
      },
    },
  }
);

// Pre-save middleware for data sanitization
assetSchema.pre("save", function (next) {
  // Sanitize string fields
  if (this.name) this.name = this.name.trim();
  if (this.category) this.category = this.category.trim();
  if (this.description) this.description = this.description.trim();

  next();
});

// Pre-update middleware for data sanitization
assetSchema.pre(
  ["updateOne", "findOneAndUpdate", "updateMany"],
  function (next) {
    const update = this.getUpdate() as any;

    // Sanitize string fields in updates
    if (update.name) update.name = update.name.trim();
    if (update.category) update.category = update.category.trim();
    if (update.description) update.description = update.description.trim();

    next();
  }
);

// Indexes for better query performance and security
assetSchema.index({ userId: 1, category: 1 });
assetSchema.index({ userId: 1, createdAt: -1 });
assetSchema.index({ userId: 1, currentValue: -1 });

// Compound index for efficient filtering and sorting
assetSchema.index({ userId: 1, category: 1, createdAt: -1 });

// Text index for search functionality (if needed in the future)
// assetSchema.index({ name: 'text', category: 'text', notes: 'text' });

// Virtual for formatted current value display
assetSchema.virtual("formattedCurrentValue").get(function () {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(this.currentValue);
});

// Ensure virtuals are included when converting to JSON
assetSchema.set("toJSON", { virtuals: true });
assetSchema.set("toObject", { virtuals: true });

export const Asset =
  mongoose.models.Asset || mongoose.model<IAsset>("Asset", assetSchema);
