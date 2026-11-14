import { requireAdmin } from "../../../../../lib/auth";
import { listContactSubmissions } from "../../../../../lib/prisma";
import { pageParams, safe } from "../../../../../lib/http";

export async function GET(request) {
  return safe(async () => {
    await requireAdmin();
    const { page, limit, skip } = pageParams(request);
    const { submissions, total } = await listContactSubmissions({ limit, offset: skip });
    return Response.json({
      success: true,
      data: submissions,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  });
}
