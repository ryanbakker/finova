import mongoose, { Schema, Document } from "mongoose";

export interface IReport extends Document {
  userId: string;
  title: string;
  content: string;
  type: "summary" | "detailed" | "custom";
  status: "generating" | "completed" | "failed";
  metadata: {
    generatedAt: Date;
    dataRange?: {
      startDate: Date;
      endDate: Date;
    };
    prompt?: string;
    model?: string;
    tokensUsed?: number;
  };
  insights?: {
    keyFindings: string[];
    recommendations: string[];
    riskFactors: string[];
    financialHealthScore?: number;
    trends?: {
      spending: string;
      income: string;
      savings: string;
      netWorth: string;
    };
    opportunities?: string[];
    warnings?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new Schema<IReport>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["summary", "detailed", "custom"],
      required: true,
      default: "summary",
    },
    status: {
      type: String,
      enum: ["generating", "completed", "failed"],
      default: "generating",
    },
    metadata: {
      generatedAt: {
        type: Date,
        required: true,
        default: Date.now,
      },
      dataRange: {
        startDate: {
          type: Date,
          required: false,
        },
        endDate: {
          type: Date,
          required: false,
        },
      },
      prompt: {
        type: String,
        required: false,
      },
      model: {
        type: String,
        required: false,
        default: "basic",
      },
      tokensUsed: {
        type: Number,
        required: false,
      },
    },
    insights: {
      keyFindings: [
        {
          type: String,
        },
      ],
      recommendations: [
        {
          type: String,
        },
      ],
      riskFactors: [
        {
          type: String,
        },
      ],
      financialHealthScore: {
        type: Number,
        min: 0,
        max: 100,
      },
      trends: {
        spending: {
          type: String,
        },
        income: {
          type: String,
        },
        savings: {
          type: String,
        },
        netWorth: {
          type: String,
        },
      },
      opportunities: [
        {
          type: String,
        },
      ],
      warnings: [
        {
          type: String,
        },
      ],
    },
  },
  {
    timestamps: true,
    collection: "reports",
  }
);

// Indexes for better query performance
reportSchema.index({ userId: 1, createdAt: -1 });
reportSchema.index({ userId: 1, type: 1 });
reportSchema.index({ userId: 1, status: 1 });

export const Report =
  mongoose.models.Report || mongoose.model<IReport>("Report", reportSchema);
