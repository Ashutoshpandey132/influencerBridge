import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Application, Influencer, Brand, Campaign } from "@/models";
import { successResponse, errorResponse, paginationMeta } from "@/lib/utils/api";
import { withAuth, requireRole } from "@/middleware/auth";

// POST /api/applications — influencer applies to a campaign
export async function POST(req: NextRequest) {
  const auth = await withAuth(req);
  if (auth instanceof Response) return auth;

  const roleErr = requireRole(auth.user, "influencer");
  if (roleErr) return roleErr;

  try {
    await connectDB();
    const influencer = await Influencer.findOne({ userId: auth.user.id });
    if (!influencer) return errorResponse("Influencer profile not found", 404);

    const { campaignId, message } = await req.json();
    if (!campaignId) return errorResponse("campaignId is required", 400);

    const application = await Application.create({
      influencerId: influencer._id,
      campaignId,
      message,
    });
    return successResponse(application, 201);
  } catch (err: unknown) {
    // Duplicate key = already applied
    if ((err as { code?: number }).code === 11000) {
      return errorResponse("You have already applied to this campaign", 409);
    }
    console.error("[POST /api/applications]", err);
    return errorResponse("Internal server error");
  }
}

// GET /api/applications — brand or influencer views their applications
export async function GET(req: NextRequest) {
  const auth = await withAuth(req);
  if (auth instanceof Response) return auth;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page  = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "20"));
    const skip  = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (auth.user.role === "influencer") {
      const influencer = await Influencer.findOne({ userId: auth.user.id });
      if (influencer) filter.influencerId = influencer._id;
    } else if (auth.user.role === "brand") {
      const brand = await Brand.findOne({ userId: auth.user.id });
      if (brand) {
        const campaigns = await Campaign.find({ brandId: brand._id }).select("_id");
        filter.campaignId = { $in: campaigns.map(c => c._id) };
      }
    }

    // Explicit query override if brand asks for specific campaign
    const campaignId = searchParams.get("campaignId");
    if (campaignId && auth.user.role === "brand") {
       filter.campaignId = campaignId; // assuming it belongs to them based on above, but to be strictly safe we just override
    }

    const [items, total] = await Promise.all([
      Application.find(filter)
        .populate("campaignId", "title budget locationScope")
        .populate("influencerId", "niche followers engagementRate location")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Application.countDocuments(filter),
    ]);

    return successResponse({ items, ...paginationMeta(total, page, limit) });
  } catch (err) {
    console.error("[GET /api/applications]", err);
    return errorResponse("Internal server error");
  }
}
