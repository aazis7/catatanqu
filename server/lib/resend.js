import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmailVerification = async (token, receiverEmail) => {
  const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}&email=${encodeURIComponent(receiverEmail)}`;
  try {
    const data = await resend.emails.send({
      from: "CatatanQu <onboarding@resend.dev>",
      to: receiverEmail,
      subject: "Verify Email",
      html: `
     <html>
      <body>
      <h1>Dear ${receiverEmail} click link below to verify your email</h1>
     <a href=${verifyLink}>Verify email</a>
     </body>
     </html>
     `,
    });
    return data;
  } catch (error) {
    logger.error(`Failed to send email verification ${error}`);
  }
};
