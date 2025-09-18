import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  photo: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  companyId: {
    type: String,
    index: true, // Add index for efficient queries
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
});

const User = models?.User || model("User", UserSchema);

export default User;
