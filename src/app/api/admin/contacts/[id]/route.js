import { requireAdmin } from "../../../../../../lib/auth";
import { findContactSubmission } from "../../../../../../lib/prisma";
import { fail, ok, safe } from "../../../../../../lib/http";

export async function GET(_request, { params }) {
  return safe(async () => {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (!Number.isInteger(id) || id < 1) return fail("Invalid contact submission ID.", 400);
    const submission = await findContactSubmission(id);
    if (!submission) return fail("Contact submission not found.", 404);
    return ok({ submission });
  });
}
