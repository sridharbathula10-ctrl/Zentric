const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || "info@zentrixds.com";

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

export async function sendEmail({ to, subject, text, replyTo }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) {
    console.error("Email not sent: configure RESEND_API_KEY and EMAIL_FROM.");
    return false;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      text,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#172033"><pre style="font:inherit;white-space:pre-wrap">${escapeHtml(text)}</pre></div>`,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Resend API error (${response.status}): ${result.message || result.name || "request failed"}`);
  }

  console.info("Email accepted by Resend:", result.id);
  return true;
}

export async function notifyAdmin(subject, text, replyTo) {
  try {
    return await sendEmail({ to: ADMIN_EMAIL, subject, text, replyTo });
  } catch (error) {
    console.error("Admin email notification failed:", error);
    return false;
  }
}

export async function notifyCustomer(subject, text, email) {
  try {
    return await sendEmail({ to: email, subject, text });
  } catch (error) {
    console.error("Customer email notification failed:", error);
    return false;
  }
}

export function ticketSummary(ticket) {
  return [
    `Ticket: ${ticket.ticketNumber}`,
    `Customer: ${ticket.customer.name}`,
    `Email: ${ticket.customer.email}`,
    `Phone: ${ticket.customer.mobile || "Not provided"}`,
    `Subject: ${ticket.subject}`,
    `Category: ${ticket.category}`,
    `Priority: ${ticket.priority}`,
    `Status: ${ticket.status}`,
    "",
    "Description:",
    ticket.description,
  ].join("\n");
}
