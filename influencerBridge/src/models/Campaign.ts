import mongoose, { Schema, model, models, Document } from "mongoose";
import { LocationScope, CampaignStatus, Niche } from "@/types";

export interface ICampaignDocument extends Document {
  title: string;
  description: string;
  budget: number;
  locationScope: LocationScope;
  brandId: mongoose.Types.ObjectId;
  targetNiches?: Niche[];
  minFollowers?: number;
  status: CampaignStatus;
}

const CampaignSchema = new Schema<ICampaignDocument>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true, min: 0 },
    locationScope: {
      type: String,
      enum: ["local", "state", "national"],
      required: true,
    },
    brandId: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
    targetNiches: [{ type: String, enum: ["fashion","tech","fitness","food","travel","beauty","gaming","education","lifestyle","other"] }],
    minFollowers: { type: Number, min: 0 },
    status: { type: String, enum: ["draft", "active", "closed"], default: "draft" },
  },
  { timestamps: true }
);

CampaignSchema.index({ status: 1 });
CampaignSchema.index({ locationScope: 1 });
CampaignSchema.index({ brandId: 1 });

const Campaign = models.Campaign ?? model<ICampaignDocument>("Campaign", CampaignSchema);
export default Campaign;
