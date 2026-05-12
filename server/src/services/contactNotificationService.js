import ApiError from "../utils/ApiError.js";

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const getProvider = () => {
  if (process.env.CONTACT_NOTIFICATION_PROVIDER) {
    return process.env.CONTACT_NOTIFICATION_PROVIDER.trim().toLowerCase();
  }

  if (process.env.RESEND_API_KEY) {
    return "resend";
  }

  return "";
};

const getNotificationConfig = () => ({
  provider: getProvider(),
  toEmail: process.env.CONTACT_NOTIFICATION_TO_EMAIL?.trim() || "",
  fromEmail: process.env.CONTACT_NOTIFICATION_FROM_EMAIL?.trim() || "",
});

const buildTextBody = (message) => [
  "New contact form submission",
  "",
  `Name: ${message.name}`,
  `Email: ${message.email}`,
  `Subject: ${message.subject}`,
  "",
  "Message:",
  message.message,
  "",
  `Received At: ${new Date(message.createdAt || Date.now()).toISOString()}`,
].join("\n");

const buildHtmlBody = (message) => `
  <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;">
    <h2 style="margin-bottom:16px;">New contact form submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(message.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(message.email)}</p>
    <p><strong>Subject:</strong> ${escapeHtml(message.subject)}</p>
    <p><strong>Received At:</strong> ${escapeHtml(new Date(message.createdAt || Date.now()).toISOString())}</p>
    <div style="margin-top:20px;padding:16px;border:1px solid #e5e7eb;border-radius:12px;background:#f9fafb;">
      <p style="margin:0 0 8px;"><strong>Message</strong></p>
      <p style="margin:0;white-space:pre-wrap;">${escapeHtml(message.message)}</p>
    </div>
  </div>
`;

const sendWithResend = async (message, config) => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: config.fromEmail,
      to: [config.toEmail],
      reply_to: message.email,
      subject: `New portfolio contact: ${message.subject}`,
      text: buildTextBody(message),
      html: buildHtmlBody(message),
    }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const details = Array.isArray(payload?.errors)
      ? payload.errors.map((entry) => entry.message || "Unknown notification error").join(" | ")
      : payload?.message || "Unable to send notification email";
    throw new ApiError(502, `Contact notification failed: ${details}`);
  }

  return payload;
};

export const sendContactNotification = async (message) => {
  const config = getNotificationConfig();

  if (!config.provider || !config.toEmail || !config.fromEmail) {
    return { delivered: false, skipped: true, reason: "Contact notifications not configured" };
  }

  if (config.provider !== "resend") {
    throw new ApiError(500, `Unsupported contact notification provider: ${config.provider}`);
  }

  await sendWithResend(message, config);
  return { delivered: true, skipped: false };
};
