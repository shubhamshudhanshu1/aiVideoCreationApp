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
  await transporter.sendMail({
    from: process.env.MAIL_FROM || "no-reply@yourapp.com",
    to,
    subject: "Your login code",
    text: `Your code is ${code}. It expires in 5 minutes.`,
    html: `<p>Your code is <b>${code}</b>. It expires in 5 minutes.</p>`,
  });
}
