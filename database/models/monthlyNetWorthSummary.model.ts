import mongoose, { Schema, Document } from "mongoose";

export interface IMonthlyNetWorthSummary extends Document {
  userId: string;
  year: number;
  month: number; // 1-12
  averageNetWorth: number;
  averageAssets: number;
  averageLiabilities: number;
  createdAt: Date;
  updatedAt: Date;
}

const monthlyNetWorthSummarySchema = new Schema<IMonthlyNetWorthSummary>(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      index: true,
      trim: true,
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
      min: [2020, "Year must be 2020 or later"],
      max: [2100, "Year cannot exceed 2100"],
    },
    month: {
      type: Number,
      required: [true, "Month is required"],
      min: [1, "Month must be between 1 and 12"],
      max: [12, "Month must be between 1 and 12"],
    },
    averageNetWorth: {
      type: Number,
      required: [true, "Average net worth is required"],
      min: [-999999999, "Average net worth cannot be less than -999,999,999"],
      max: [999999999, "Average net worth cannot exceed 999,999,999"],
    },
    averageAssets: {
      type: Number,
      required: [true, "Average assets is required"],
      min: [0, "Average assets must be non-negative"],
      max: [999999999, "Average assets cannot exceed 999,999,999"],
    },
    averageLiabilities: {
      type: Number,
      required: [true, "Average liabilities is required"],
      min: [0, "Average liabilities must be non-negative"],
      max: [999999999, "Average liabilities cannot exceed 999,999,999"],
    },
  },
  {
    timestamps: true,
    collection: "monthlyNetWorthSummary",
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

// Compound indexes for efficient queries
monthlyNetWorthSummarySchema.index({ userId: 1, year: -1, month: -1 });
monthlyNetWorthSummarySchema.index({ userId: 1, createdAt: -1 });

// Unique constraint to prevent duplicate entries for the same user/month/year
monthlyNetWorthSummarySchema.index(
  { userId: 1, year: 1, month: 1 },
  { unique: true }
);

// Virtual for formatted month name
monthlyNetWorthSummarySchema.virtual("monthName").get(function () {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return monthNames[this.month - 1];
});

// Virtual for formatted display name
monthlyNetWorthSummarySchema.virtual("displayName").get(function () {
  return `${this.monthName} ${this.year}`;
});

// Ensure virtuals are included when converting to JSON
monthlyNetWorthSummarySchema.set("toJSON", { virtuals: true });
monthlyNetWorthSummarySchema.set("toObject", { virtuals: true });

export const MonthlyNetWorthSummary =
  mongoose.models.MonthlyNetWorthSummary ||
  mongoose.model<IMonthlyNetWorthSummary>(
    "MonthlyNetWorthSummary",
    monthlyNetWorthSummarySchema
  );
