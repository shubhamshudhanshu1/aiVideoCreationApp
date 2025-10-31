import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST!;
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: false,
  ...(smtpUser && smtpPass
    ? { auth: { user: smtpUser, pass: smtpPass } }
    : {}),
});

export async function sendOtpEmail(to: string, code: string) {
  console.log("📧 [EMAIL] Attempting to send OTP email:", { to });

  try {
    const result = await transporter.sendMail({
      from: process.env.MAIL_FROM || "no-reply@ai-video-app.com",
      to,
      subject: "Your login code",
      text: `Your code is ${code}. It expires in 5 minutes.`,
      html: `<p>Your code is <b>${code}</b>. It expires in 5 minutes.</p>`,
    });

    console.log("✅ [EMAIL] Email sent successfully:", {
      messageId: result.messageId,
      to,
      accepted: result.accepted,
      rejected: result.rejected,
    });

    return result;
  } catch (error) {
    console.error("❌ [EMAIL] Failed to send email:", {
      to,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}
