import mongoose, { Schema, model, models, Document } from "mongoose";
import { Niche } from "@/types";

export interface IInfluencerDocument extends Document {
  userId: mongoose.Types.ObjectId;
  niche: Niche;
  followers: number;
  engagementRate: number;
  location: { city: string; state: string; country: string };
  openToWork: boolean;
  bio?: string;
  socialLinks?: {
    instagram?: string;
    youtube?: string;
    twitter?: string;
    tiktok?: string;
  };
}

const InfluencerSchema = new Schema<IInfluencerDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    niche: {
      type: String,
      enum: ["fashion","tech","fitness","food","travel","beauty","gaming","education","lifestyle","other"],
      required: true,
    },
    followers: { type: Number, required: true, min: 0 },
    engagementRate: { type: Number, required: true, min: 0, max: 100 },
    location: {
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
    },
    openToWork: { type: Boolean, default: true },
    bio: { type: String, maxlength: 500 },
    socialLinks: {
      instagram: String,
      youtube: String,
      twitter: String,
      tiktok: String,
    },
  },
  { timestamps: true }
);

// Indexes for discovery queries
InfluencerSchema.index({ "location.city": 1, "location.state": 1 });
InfluencerSchema.index({ niche: 1 });
InfluencerSchema.index({ openToWork: 1 });
InfluencerSchema.index({ followers: -1 });

const Influencer = models.Influencer ?? model<IInfluencerDocument>("Influencer", InfluencerSchema);
export default Influencer;
