import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { User, Influencer, Brand } from "@/models";
import { successResponse, errorResponse } from "@/lib/utils/api";
import { withAuth } from "@/middleware/auth";

export async function GET(req: NextRequest) {
  const auth = await withAuth(req);
  if (auth instanceof Response) return auth;

  try {
    await connectDB();
    
    const user = await User.findById(auth.user.id).select("-password -__v");
    if (!user) return errorResponse("User not found", 404);

    let profileData: any = {};
    if (user.role === "influencer") {
      const influencer = await Influencer.findOne({ userId: user._id }).select("-__v");
      profileData = influencer ? influencer.toObject() : {};
    } else if (user.role === "brand") {
      const brand = await Brand.findOne({ userId: user._id }).select("-__v");
      profileData = brand ? brand.toObject() : {};
    }

    return successResponse({ user: user.toObject(), profile: profileData });
  } catch (err) {
    console.error("[GET /api/profile]", err);
    return errorResponse("Internal server error");
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await withAuth(req);
  if (auth instanceof Response) return auth;

  try {
    await connectDB();
    const body = await req.json();

    const user = await User.findById(auth.user.id);
    if (!user) return errorResponse("User not found", 404);

    // Update shared User fields if provided
    if (body.name) user.name = body.name;
    // Don't blindly allow email change without verifying unicity, skipping email for now
    await user.save();

    let updatedProfile = null;

    if (user.role === "influencer") {
      updatedProfile = await Influencer.findOneAndUpdate(
        { userId: user._id },
        { $set: {
            niche: body.niche,
            followers: body.followers,
            engagementRate: body.engagementRate,
            location: body.location,
            openToWork: body.openToWork,
            bio: body.bio,
            socialLinks: body.socialLinks
        }},
        { new: true, runValidators: true }
      );
    } else if (user.role === "brand") {
      updatedProfile = await Brand.findOneAndUpdate(
        { userId: user._id },
        { $set: {
            companyName: body.companyName,
            industry: body.industry,
            location: body.location,
            website: body.website,
            logo: body.logo
        }},
        { new: true, runValidators: true }
      );
    }

    return successResponse({ user, profile: updatedProfile });
  } catch (err) {
    console.error("[PATCH /api/profile]", err);
    return errorResponse("Internal server error");
  }
}
