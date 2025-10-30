import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST!,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
});

export async function sendOtpEmail(to: string, code: string) {
  console.log("📧 [EMAIL] Attempting to send OTP email:", { to, code });
  console.log(
    process.env.SMTP_PORT,
    process.env.SMTP_USER,
    process.env.SMTP_PASS,
    process.env.MAIL_FROM,
    "sfsfsf"
  );
  try {
    const result = await transporter.sendMail({
      from: process.env.MAIL_FROM,
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
