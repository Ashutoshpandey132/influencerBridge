import mongoose, { Schema, model, models, Document } from "mongoose";
import { ApplicationStatus } from "@/types";

export interface IApplicationDocument extends Document {
  influencerId: mongoose.Types.ObjectId;
  campaignId: mongoose.Types.ObjectId;
  status: ApplicationStatus;
  message?: string;
}

const ApplicationSchema = new Schema<IApplicationDocument>(
  {
    influencerId: { type: Schema.Types.ObjectId, ref: "Influencer", required: true },
    campaignId: { type: Schema.Types.ObjectId, ref: "Campaign", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    message: { type: String, maxlength: 1000 },
  },
  { timestamps: true }
);

// Prevent duplicate applications
ApplicationSchema.index({ influencerId: 1, campaignId: 1 }, { unique: true });
ApplicationSchema.index({ campaignId: 1, status: 1 });

const Application = models.Application ?? model<IApplicationDocument>("Application", ApplicationSchema);
export default Application;
