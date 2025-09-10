import mongoose, { Schema, Document } from "mongoose";

export interface IValueHistory extends Document {
  userId: string;
  itemId: string; // The ID of the asset or liability this entry belongs to
  itemType: "ASSET" | "LIABILITY";
  value: number;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const valueHistorySchema = new Schema<IValueHistory>(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      index: true,
      trim: true,
    },
    itemId: {
      type: String,
      required: [true, "Item ID is required"],
      index: true,
      trim: true,
    },
    itemType: {
      type: String,
      required: [true, "Item type is required"],
      enum: ["ASSET", "LIABILITY"],
      index: true,
    },
    value: {
      type: Number,
      required: [true, "Value is required"],
      min: [0, "Value must be non-negative"],
      max: [999999999, "Value cannot exceed 999,999,999"],
    },
    timestamp: {
      type: Date,
      required: [true, "Timestamp is required"],
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "valueHistory",
    toJSON: {
      transform: function (doc, ret) {
        // Ensure _id is converted to string for JSON serialization
        if (ret._id) {
          ret.id = ret._id.toString();
          delete ret._id;
        }
        // Ensure userId and itemId are included in response
        if (ret.userId) {
          ret.userId = ret.userId.toString();
        }
        if (ret.itemId) {
          ret.itemId = ret.itemId.toString();
        }
        return ret;
      },
    },
  }
);

// Compound indexes for efficient queries
valueHistorySchema.index({ userId: 1, itemType: 1, timestamp: -1 });
valueHistorySchema.index({ userId: 1, itemId: 1, timestamp: -1 });
valueHistorySchema.index({ userId: 1, timestamp: -1 });
valueHistorySchema.index({ itemId: 1, timestamp: -1 });

// Text index for search functionality (if needed in the future)
// valueHistorySchema.index({ itemId: 'text' });

export const ValueHistory =
  mongoose.models.ValueHistory ||
  mongoose.model<IValueHistory>("ValueHistory", valueHistorySchema);

