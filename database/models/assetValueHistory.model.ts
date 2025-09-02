/**
 * @deprecated This model is no longer used. Asset value history is now stored
 * as an array within the Asset model's valueHistory field.
 * This file is kept for reference and potential data migration purposes.
 */
import mongoose, { Schema, Document } from "mongoose";

export interface IAssetValueHistory extends Document {
  assetId: string;
  userId: string;
  previousValue: number;
  newValue: number;
  changeAmount: number;
  changePercentage: number;
  currency: string;
  changeReason?: string;
  changeDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const assetValueHistorySchema = new Schema<IAssetValueHistory>(
  {
    assetId: {
      type: String,
      required: [true, "Asset ID is required"],
      index: true,
      trim: true,
    },
    userId: {
      type: String,
      required: [true, "User ID is required"],
      index: true,
      trim: true,
    },
    previousValue: {
      type: Number,
      required: [true, "Previous value is required"],
      min: [0, "Previous value must be non-negative"],
      max: [999999999, "Previous value cannot exceed 999,999,999"],
    },
    newValue: {
      type: Number,
      required: [true, "New value is required"],
      min: [0, "New value must be non-negative"],
      max: [999999999, "New value cannot exceed 999,999,999"],
    },
    changeAmount: {
      type: Number,
      required: [true, "Change amount is required"],
      min: [-999999999, "Change amount cannot be less than -999,999,999"],
      max: [999999999, "Change amount cannot exceed 999,999,999"],
    },
    changePercentage: {
      type: Number,
      required: [true, "Change percentage is required"],
      min: [-100, "Change percentage cannot be less than -100%"],
      max: [1000, "Change percentage cannot exceed 1000%"],
    },
    currency: {
      type: String,
      required: [true, "Currency is required"],
      default: "USD",
      trim: true,
      uppercase: true,
      minlength: [3, "Currency must be at least 3 characters"],
      maxlength: [3, "Currency must be exactly 3 characters"],
    },
    changeReason: {
      type: String,
      required: false,
      trim: true,
      maxlength: [500, "Change reason cannot exceed 500 characters"],
    },
    changeDate: {
      type: Date,
      required: [true, "Change date is required"],
      default: Date.now,
      validate: {
        validator: function (value: Date) {
          const now = new Date();
          const maxDate = new Date(
            now.getFullYear() + 1,
            now.getMonth(),
            now.getDate()
          ); // 1 year in future
          return value <= maxDate;
        },
        message: "Change date cannot be more than 1 year in the future",
      },
    },
  },
  {
    timestamps: true,
    collection: "assetValueHistory",
    toJSON: {
      transform: function (doc, ret) {
        // Ensure _id is converted to string for JSON serialization
        if (ret._id) {
          ret.id = ret._id.toString();
          delete ret._id;
        }
        // Ensure userId and assetId are included in response
        if (ret.userId) {
          ret.userId = ret.userId.toString();
        }
        if (ret.assetId) {
          ret.assetId = ret.assetId.toString();
        }
        return ret;
      },
    },
  }
);

// Pre-save middleware for data sanitization and calculation
assetValueHistorySchema.pre("save", function (next) {
  // Sanitize string fields
  if (this.changeReason) this.changeReason = this.changeReason.trim();

  // Ensure currency is uppercase
  if (this.currency) this.currency = this.currency.toUpperCase();

  // Calculate changeAmount and changePercentage if not provided
  if (this.changeAmount === undefined || this.changeAmount === null) {
    this.changeAmount = this.newValue - this.previousValue;
  }

  if (this.changePercentage === undefined || this.changePercentage === null) {
    this.changePercentage =
      this.previousValue > 0
        ? (this.changeAmount / this.previousValue) * 100
        : 0;
  }

  next();
});

// Indexes for better query performance
assetValueHistorySchema.index({ assetId: 1, changeDate: -1 });
assetValueHistorySchema.index({ userId: 1, changeDate: -1 });
assetValueHistorySchema.index({ assetId: 1, userId: 1 });

export const AssetValueHistory =
  mongoose.models.AssetValueHistory ||
  mongoose.model<IAssetValueHistory>(
    "AssetValueHistory",
    assetValueHistorySchema
  );
