import bcrypt from "bcryptjs";
import { ensureCompanySchema, prisma } from "../../../../../../lib/prisma";
import { requireAdmin } from "../../../../../../lib/auth";
import { ok, fail, safe } from "../../../../../../lib/http";

export async function POST(request) {
  return safe(async () => {
    await requireAdmin();
    await ensureCompanySchema();
    const { name, email, mobile, password, companyId } = await request.json();
    if (!name?.trim() || !email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) || !mobile?.match(/^\d{10,15}$/) || !password || password.length < 8) {
      return fail("Provide a valid name, email, mobile number, and password of at least 8 characters.", 400);
    }
    const parsedCompanyId = Number(companyId);
    if (!Number.isInteger(parsedCompanyId) || parsedCompanyId < 1 || !(await prisma.company.findUnique({ where: { id: parsedCompanyId } }))) {
      return fail("Select a valid company.", 400);
    }
    const normalizedEmail = email.toLowerCase().trim();
    if (await prisma.user.findUnique({ where: { email: normalizedEmail } })) {
      return fail("An account with this email already exists.", 409);
    }
    const customer = await prisma.user.create({
      data: { name: name.trim(), email: normalizedEmail, mobile, companyId: parsedCompanyId, password: await bcrypt.hash(password, 12), role: "CUSTOMER" },
      select: { id: true, name: true, email: true, mobile: true, status: true, createdAt: true },
    });
    return ok({ customer }, "Customer created successfully", 201);
  });
}
