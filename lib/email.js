import nodemailer from "nodemailer";

const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || "info@zentrixds.com";

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function createTransporter() {
  const host = process.env.RESEND_SMTP_HOST || "smtp.resend.com";
  const port = Number(process.env.RESEND_SMTP_PORT || 465);
  const user = process.env.RESEND_SMTP_USER || "resend";
  const password = process.env.RESEND_SMTP_PASSWORD;

  if (!password) {
    console.error("Email not sent: configure RESEND_SMTP_PASSWORD.");
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass: password },
  });
}

export async function sendEmail({ to, subject, text, replyTo }) {
  const from = process.env.EMAIL_FROM;
  if (!from) {
    console.error("Email not sent: configure EMAIL_FROM.");
    return false;
  }

  const transporter = createTransporter();
  if (!transporter) return false;

  const info = await transporter.sendMail({
    from,
    to: Array.isArray(to) ? to.join(", ") : to,
    subject,
    text,
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#172033"><pre style="font:inherit;white-space:pre-wrap">${escapeHtml(text)}</pre></div>`,
    ...(replyTo ? { replyTo } : {}),
  });

  console.info("Email accepted by SMTP server:", info.messageId);
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
