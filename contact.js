// Vercel Serverless Function: /api/contact
// Sends contact form emails via Resend (https://resend.com)
//
// Required env vars (set in Vercel Project Settings):
// - RESEND_API_KEY
// - CONTACT_TO_EMAIL (where you receive emails)
// Optional:
// - CONTACT_FROM_EMAIL (must be a verified sender in Resend; otherwise use onboarding@resend.dev for testing)
// - CONTACT_SUBJECT_PREFIX

function escapeHtml(input = "") {
  return String(input)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";
  const subjectPrefix = process.env.CONTACT_SUBJECT_PREFIX || "Portfolio";

  if (!apiKey) return res.status(500).json({ ok: false, error: "Missing RESEND_API_KEY" });
  if (!toEmail) return res.status(500).json({ ok: false, error: "Missing CONTACT_TO_EMAIL" });

  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ ok: false, error: "Invalid JSON" });
  }

  const name = (body?.name || "").trim();
  const email = (body?.email || "").trim();
  const message = (body?.message || "").trim();

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: "All fields are required" });
  }

  // Basic email sanity check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: "Invalid email" });
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br/>");

  const subject = `${subjectPrefix}: New message from ${name}`;

  const html = `
    <div style="font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; line-height: 1.5;">
      <h2 style="margin:0 0 12px;">New contact form message</h2>
      <p style="margin:0 0 8px;"><strong>Name:</strong> ${safeName}</p>
      <p style="margin:0 0 8px;"><strong>Email:</strong> ${safeEmail}</p>
      <p style="margin:16px 0 8px;"><strong>Message:</strong></p>
      <div style="padding:12px; border:1px solid #e5e7eb; border-radius:10px; background:#fafafa;">
        ${safeMessage}
      </div>
    </div>
  `;

  try {
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        subject,
        html,
        headers: {
          "Reply-To": email,
        },
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return res.status(502).json({ ok: false, error: "Resend request failed", details: text });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}
