import { createContactSubmission } from "../../../../lib/prisma";
import { fail, ok, safe } from "../../../../lib/http";

const categories = ["TECHNICAL", "BILLING", "ACCOUNT", "PRODUCT", "GENERAL", "OTHER"];

export async function POST(request) {
  return safe(async () => {
    let body;
    try {
      body = await request.json();
    } catch {
      return fail("Send valid form data.", 400);
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const mobile = typeof body.mobile === "string" ? body.mobile.trim() : "";
    const category = typeof body.category === "string" ? body.category : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || name.length > 120 || !emailPattern.test(email) || email.length > 254 ||
      mobile.length > 32 || !categories.includes(category) || !message || message.length > 5000) {
      return fail("Please provide a valid name, email, category, and message.", 400);
    }

    const submission = await createContactSubmission({ name, email, mobile, category, message });
    return ok({ id: submission.id }, "Thanks for contacting us. We’ll be in touch soon.", 201);
  });
}
