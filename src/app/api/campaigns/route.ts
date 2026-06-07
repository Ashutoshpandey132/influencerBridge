import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Campaign, Brand } from "@/models";
import { successResponse, errorResponse, paginationMeta } from "@/lib/utils/api";
import { withAuth, requireRole } from "@/middleware/auth";

// GET /api/campaigns — public, filterable, paginated
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "12"));
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = { status: "active" };
    const scope = searchParams.get("locationScope");
    const niche = searchParams.get("niche");
    const minBudget = searchParams.get("minBudget");

    if (scope) filter.locationScope = scope;
    if (niche) filter.targetNiches = niche;
    if (minBudget) filter.budget = { $gte: parseInt(minBudget) };

    const [items, total] = await Promise.all([
      Campaign.find(filter)
        .populate("brandId", "companyName industry location logo")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Campaign.countDocuments(filter),
    ]);

    return successResponse({ items, ...paginationMeta(total, page, limit) });
  } catch (err) {
    console.error("[GET /api/campaigns]", err);
    return errorResponse("Internal server error");
  }
}

// POST /api/campaigns — protected, brand role only
export async function POST(req: NextRequest) {
  const auth = await withAuth(req);
  if (auth instanceof Response) return auth;

  const roleErr = requireRole(auth.user, "brand");
  if (roleErr) return roleErr;

  try {
    await connectDB();
    const brand = await Brand.findOne({ userId: auth.user.id });
    if (!brand) return errorResponse("Brand profile not found", 404);

    const body = await req.json();
    const campaign = await Campaign.create({ ...body, brandId: brand._id });
    return successResponse(campaign, 201);
  } catch (err) {
    console.error("[POST /api/campaigns]", err);
    return errorResponse("Internal server error");
  }
}
