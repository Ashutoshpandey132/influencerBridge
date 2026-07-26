import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IBrandDocument extends Document {
  userId: mongoose.Types.ObjectId;
  companyName: string;
  industry: string;
  location: { city: string; state: string; country: string };
  website?: string;
  logo?: string;
}

const BrandSchema = new Schema<IBrandDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    companyName: { type: String, required: true, trim: true },
    industry: { type: String, required: true },
    location: {
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
    },
    website: String,
    logo: String,
  },
  { timestamps: true }
);

BrandSchema.index({ "location.city": 1, "location.state": 1 });
BrandSchema.index({ industry: 1 });

const Brand = models.Brand ?? model<IBrandDocument>("Brand", BrandSchema);
export default Brand;
