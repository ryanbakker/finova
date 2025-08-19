import { Schema, model, models } from "mongoose";

const GoalSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true, // Add index for better query performance
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    targetAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    currentAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    currency: {
      type: String,
      required: true,
      default: "AUD",
    },
    targetDate: {
      type: Date,
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
      default: "medium",
    },
    status: {
      type: String,
      enum: ["active", "completed", "paused"],
      required: true,
      default: "active",
    },
    notes: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Compound index for userId + isActive for efficient queries
GoalSchema.index({ userId: 1, isActive: 1 });

// Compound index for userId + status for filtering
GoalSchema.index({ userId: 1, status: 1 });

// Compound index for userId + priority for sorting
GoalSchema.index({ userId: 1, priority: 1 });

const Goal = models?.Goal || model("Goal", GoalSchema);

export default Goal;
