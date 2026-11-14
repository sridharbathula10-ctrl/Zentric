import { ensureCompanySchema, prisma } from "../../../../../../lib/prisma";
import { requireAdmin } from "../../../../../../lib/auth";
import { fail, ok, safe } from "../../../../../../lib/http";

function parseId(rawId) {
  const id = Number(rawId);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function PUT(request, { params }) {
  return safe(async () => {
    await requireAdmin();
    await ensureCompanySchema();
    const { id: rawId } = await params;
    const id = parseId(rawId);
    if (!id) return fail("Invalid company ID.", 400);
    let body;
    try {
      body = await request.json();
    } catch {
      return fail("Send a valid company name.", 400);
    }
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name || name.length > 150) return fail("Company name is required and must be 150 characters or fewer.", 400);
    if (!(await prisma.company.findUnique({ where: { id } }))) return fail("Company not found.", 404);
    try {
      const company = await prisma.company.update({ where: { id }, data: { name } });
      return ok({ company }, "Company updated successfully.");
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") return fail("A company with this name already exists.", 409);
      throw error;
    }
  });
}

export async function DELETE(_request, { params }) {
  return safe(async () => {
    await requireAdmin();
    await ensureCompanySchema();
    const { id: rawId } = await params;
    const id = parseId(rawId);
    if (!id) return fail("Invalid company ID.", 400);
    const result = await prisma.company.deleteIfUnused({ where: { id } });
    if (result.affectedRows) return ok({}, "Company deleted successfully.");
    if (!(await prisma.company.findUnique({ where: { id } }))) return fail("Company not found.", 404);
    return fail("This company has customers. Reassign them before deleting the company.", 409);
  });
}
