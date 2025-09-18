import { Schema, model, models } from "mongoose";

const CompanySchema = new Schema({
  companyId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  subscription: {
    plan: {
      type: String,
      enum: ["free", "premium", "pro"],
      default: "free",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "cancelled", "past_due"],
      default: "active",
    },
    currentPeriodEnd: {
      type: Date,
    },
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
CompanySchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Company = models?.Company || model("Company", CompanySchema);

export default Company;
