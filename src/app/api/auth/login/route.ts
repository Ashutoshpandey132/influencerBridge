import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/models";
import { signToken } from "@/lib/auth/jwt";
import { successResponse, errorResponse } from "@/lib/utils/api";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return errorResponse("Email and password are required", 400);
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return errorResponse("Invalid credentials", 401);
    }

    const token = await signToken({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return successResponse({ token, user });
  } catch (err) {
    console.error("[LOGIN]", err);
    return errorResponse("Internal server error");
  }
}
