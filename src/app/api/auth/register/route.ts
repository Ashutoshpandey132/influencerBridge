import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { User, Influencer, Brand } from "@/models";
import { signToken } from "@/lib/auth/jwt";
import { successResponse, errorResponse } from "@/lib/utils/api";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return errorResponse("All fields are required", 400);
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return errorResponse("Email already registered", 409);
    }

    const user = await User.create({ name, email, password, role });

    // Scaffold the associated profile document
    if (role === "influencer") {
      await Influencer.create({
        userId: user._id,
        niche: "other",
        followers: 0,
        engagementRate: 0,
        location: { city: "Unknown", state: "Unknown", country: "Unknown" },
      });
    } else if (role === "brand") {
      await Brand.create({
        userId: user._id,
        companyName: name, // Placeholder
        industry: "Unknown",
        location: { city: "Unknown", state: "Unknown", country: "Unknown" },
      });
    }

    const token = await signToken({ id: user._id.toString(), name, email, role });

    return successResponse({ token, user }, 201);
  } catch (err) {
    console.error("[REGISTER]", err);
    return errorResponse("Internal server error");
  }
}
