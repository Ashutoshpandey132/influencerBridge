import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Influencer } from "@/models";
import { successResponse, errorResponse, paginationMeta } from "@/lib/utils/api";
import { withAuth, requireRole } from "@/middleware/auth";

// GET /api/influencers — public, filterable, paginated
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "12"));
    const skip = (page - 1) * limit;

    // Build filter
    const filter: Record<string, unknown> = {};
    const niche = searchParams.get("niche");
    const city = searchParams.get("city");
    const state = searchParams.get("state");
    const openToWork = searchParams.get("openToWork");
    const minFollowers = searchParams.get("minFollowers");

    if (niche) filter.niche = niche;
    if (city) filter["location.city"] = new RegExp(city, "i");
    if (state) filter["location.state"] = new RegExp(state, "i");
    if (openToWork === "true") filter.openToWork = true;
    if (minFollowers) filter.followers = { $gte: parseInt(minFollowers) };

    const [items, total] = await Promise.all([
      Influencer.find(filter)
        .populate("userId", "name email")
        .sort({ followers: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Influencer.countDocuments(filter),
    ]);

    return successResponse({ items, ...paginationMeta(total, page, limit) });
  } catch (err) {
    console.error("[GET /api/influencers]", err);
    return errorResponse("Internal server error");
  }
}

// POST /api/influencers — protected, influencer role only
export async function POST(req: NextRequest) {
  const auth = await withAuth(req);
  if (auth instanceof Response) return auth;

  const roleErr = requireRole(auth.user, "influencer");
  if (roleErr) return roleErr;

  try {
    await connectDB();
    const body = await req.json();
    const influencer = await Influencer.create({ ...body, userId: auth.user.id });
    return successResponse(influencer, 201);
  } catch (err) {
    console.error("[POST /api/influencers]", err);
    return errorResponse("Internal server error");
  }
}
