import bcrypt from "bcryptjs";
import { prisma } from "../../../../../../lib/prisma";
import { requireAdmin } from "../../../../../../lib/auth";
import { ok, fail, safe } from "../../../../../../lib/http";

export async function POST(request) {
  return safe(async () => {
    await requireAdmin();
    const { name, email, mobile, password } = await request.json();
    if (!name?.trim() || !email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) || !mobile?.match(/^\d{10,15}$/) || !password || password.length < 8) {
      return fail("Provide a valid name, email, mobile number, and password of at least 8 characters.", 400);
    }
    const normalizedEmail = email.toLowerCase().trim();
    if (await prisma.user.findUnique({ where: { email: normalizedEmail } })) {
      return fail("An account with this email already exists.", 409);
    }
    const customer = await prisma.user.create({
      data: { name: name.trim(), email: normalizedEmail, mobile, password: await bcrypt.hash(password, 12), role: "CUSTOMER" },
      select: { id: true, name: true, email: true, mobile: true, status: true, createdAt: true },
    });
    return ok({ customer }, "Customer created successfully", 201);
  });
}
