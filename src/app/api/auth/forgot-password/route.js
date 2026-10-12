import { prisma } from "../../../../../lib/prisma";
import { fail, ok, safe } from "../../../../../lib/http";

export async function POST(request) {
  return safe(async () => {
    const { email } = await request.json();
    const normalizedEmail = email?.toLowerCase().trim();

    if (!normalizedEmail?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return fail("Enter a valid email address.", 400);
    }

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) return fail("No account was found with this email address.", 404);

    return ok({ email: user.email }, "Email address verified.");
  });
}
