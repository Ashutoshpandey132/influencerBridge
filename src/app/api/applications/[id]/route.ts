import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Application, Campaign, Brand } from "@/models";
import { successResponse, errorResponse } from "@/lib/utils/api";
import { withAuth, requireRole } from "@/middleware/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await withAuth(req);
  if (auth instanceof Response) return auth;

  const roleErr = requireRole(auth.user, "brand");
  if (roleErr) return roleErr;

  const { id } = await params;

  try {
    await connectDB();
    const body = await req.json();
    const { status } = body;

    if (!["accepted", "rejected"].includes(status)) {
      return errorResponse("Invalid status update", 400);
    }

    // Ensure the Brand owns the Campaign this application is tied to
    const brand = await Brand.findOne({ userId: auth.user.id });
    if (!brand) return errorResponse("Brand profile not found", 404);

    const application = await Application.findById(id).populate("campaignId");
    if (!application) return errorResponse("Application not found", 404);

    // Verify ownership
    const campaignStrId = (application.campaignId as any).brandId.toString();
    if (campaignStrId !== brand._id.toString()) {
      return errorResponse("Unauthorized to modify this application", 403);
    }

    application.status = status;
    await application.save();

    return successResponse(application);
  } catch (err) {
    console.error(`[PATCH /api/applications/${id}]`, err);
    return errorResponse("Internal server error");
  }
}
