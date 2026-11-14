import { ensureCompanySchema, prisma } from "../../../../../lib/prisma";
import { requireAdmin } from "../../../../../lib/auth";
import { fail, ok, safe } from "../../../../../lib/http";

export async function GET() {
  return safe(async () => {
    await requireAdmin();
    await ensureCompanySchema();
    return ok({ companies: await prisma.company.findMany() });
  });
}

export async function POST(request) {
  return safe(async () => {
    await requireAdmin();
    await ensureCompanySchema();
    let body;
    try {
      body = await request.json();
    } catch {
      return fail("Send valid company details.", 400);
    }
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name || name.length > 150) return fail("Company name is required and must be 150 characters or fewer.", 400);
    try {
      const company = await prisma.company.create({ data: { name } });
      return ok({ company }, "Company added successfully.", 201);
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") return fail("A company with this name already exists.", 409);
      throw error;
    }
  });
}
