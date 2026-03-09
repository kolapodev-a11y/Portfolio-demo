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

  // Professional, email-client-friendly HTML template (red + blue)
  // Note: Uses table-based layout + inline styles for best compatibility.
  const html = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>${subjectPrefix} Contact</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f3f4f6;">
    <!-- Preheader (hidden preview text) -->
    <div style="display:none; font-size:1px; line-height:1px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; mso-hide:all;">
      New contact form message from ${safeName}
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f3f4f6; width:100%;">
      <tr>
        <td align="center" style="padding:28px 12px;">
          <!-- Container -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:640px; width:100%; border-collapse:separate; border-spacing:0;">
            <tr>
              <td style="background:#ffffff; border:1px solid #e5e7eb; border-radius:16px; overflow:hidden;">
                <!-- Header bar -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding:18px 22px; background:#0b3d91;">
                      <div style="font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; font-size:12px; letter-spacing:0.12em; text-transform:uppercase; color:#dbeafe;">
                        ${subjectPrefix}
                      </div>
                      <div style="font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; font-size:20px; line-height:1.25; font-weight:800; color:#ffffff; margin-top:6px;">
                        New contact form message
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="height:4px; background:#dc2626; line-height:4px; font-size:0;">&nbsp;</td>
                  </tr>
                </table>

                <!-- Body -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding:22px;">
                      <!-- Details -->
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate; border-spacing:0;">
                        <tr>
                          <td style="padding:12px 14px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:12px;">
                            <div style="font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; font-size:12px; color:#6b7280;">
                              Name
                            </div>
                            <div style="font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; font-size:16px; font-weight:700; color:#111827; margin-top:4px;">
                              ${safeName}
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding-top:12px;">
                            <div style="padding:12px 14px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:12px;">
                              <div style="font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; font-size:12px; color:#6b7280;">
                                Email
                              </div>
                              <div style="font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; font-size:15px; font-weight:700; color:#1d4ed8; margin-top:4px; word-break:break-word;">
                                ${safeEmail}
                              </div>
                            </div>
                          </td>
                        </tr>
                      </table>

                      <!-- Message -->
                      <div style="font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; font-size:14px; font-weight:800; color:#111827; margin:18px 0 10px;">
                        Message
                      </div>
                      <div style="padding:16px; border:1px solid #e5e7eb; border-radius:12px; background:#ffffff; box-shadow:0 1px 0 rgba(17,24,39,0.03); font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; font-size:15px; line-height:1.65; color:#111827;">
                        ${safeMessage}
                      </div>

                      <!-- Footer note -->
                      <div style="font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; font-size:12px; line-height:1.6; color:#6b7280; margin-top:18px; padding-top:16px; border-top:1px solid #e5e7eb;">
                        This message was sent from your portfolio contact form. You can reply directly to this email.
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Outer footer -->
            <tr>
              <td align="center" style="padding:14px 10px 0;">
                <div style="font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; font-size:11px; color:#9ca3af;">
                  ${subjectPrefix} • Contact Notification
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
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
