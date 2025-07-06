import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmailVerification = async (token, receiverEmail) => {
  const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}&email=${encodeURIComponent(receiverEmail)}`;

  try {
    const data = await resend.emails.send({
      from: "CatatanQu <onboarding@resend.dev>",
      to: receiverEmail,
      subject: "Verifikasi Alamat Email",
      html: `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; }
              .content { padding: 20px 0; }
              .button {
                display: inline-block;
                padding: 12px 24px;
                background: #007bff;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
              }
              .token {
                background: #f8f9fa;
                padding: 10px;
                border-radius: 5px;
                font-family: monospace;
                word-break: break-all;
              }
              .footer { font-size: 12px; color: #666; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Selamat Datang di CatatanQu!</h1>
              </div>
              <div class="content">
                <p>Halo, ${receiverEmail},</p>
                <p>Terima kasih sudah bergabung dengan CatatanQu. Mohon konfirmasi email anda dengan mengklik tombol di bawah ini:</p>
                <p style="text-align: center;">
                  <a href="${verifyLink}" class="button">Verifikasi Alamat Email</a>
                </p>
                <p>Jika tombol tidak berfungsi, anda bisa menyalin dan menempel link ini pada browser anda:</p>
                <p style="word-break: break-all;">${verifyLink}</p>
                <p>Token verifikasi anda adalah:</p>
                <div class="token">${token}</div>
                <p><strong>Penting:</strong> Mohon jangan bagikan token ini kepada orang lain untuk alasan keamanan.</p>
                <p>Link verifikasi ini akan kadaluarsa dalam kurun waktu 24 jam.</p>
              </div>
              <div class="footer">
                <p>Jika anda tidak membuat akun pada CatatanQu, mohon abaikan email ini.</p>
                <p>© 2024 CatatanQu. Semua hak cipta dilindungi.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });
    return data;
  } catch (error) {
    console.error(`Failed to send verification email:`, error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (token, receiverEmail) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  try {
    const data = await resend.emails.send({
      from: "CatatanQu <onboarding@resend.dev>",
      to: receiverEmail,
      subject: "Reset Password Anda",
      html: `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #fff3cd; padding: 20px; text-align: center; border-radius: 8px; border-left: 4px solid #ffc107; }
              .content { padding: 20px 0; }
              .button {
                display: inline-block;
                padding: 12px 24px;
                background: #dc3545;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
              }
              .token {
                background: #f8f9fa;
                padding: 10px;
                border-radius: 5px;
                font-family: monospace;
                word-break: break-all;
              }
              .footer { font-size: 12px; color: #666; margin-top: 20px; }
              .warning { background: #f8d7da; color: #721c24; padding: 10px; border-radius: 5px; margin: 10px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Permintaan Reset Password</h1>
              </div>
              <div class="content">
                <p>Halo, ${receiverEmail},</p>
                <p>Anda telah meminta untuk mereset password anda untuk akun CatatanQu. Klik tombol di bawah ini untuk mereset password:</p>
                <p style="text-align: center;">
                  <a href="${resetLink}" class="button">Reset Password</a>
                </p>
                <p>Jika tombol tidak berfungsi, anda bisa menyalin dan menempel link ini pada browser anda:</p>
                <p style="word-break: break-all;">${resetLink}</p>
                <p>Token reset anda adalah:</p>
                <div class="token">${token}</div>
                <div class="warning">
                  <strong>Pemberitahuan Keamanan:</strong>
                  <ul>
                    <li>Link reset ini akan kadaluarsa dalam kurun waktu 1 jam</li>
                    <li>Jangan membagikan token ini kepada orang lain</li>
                    <li>Jika anda tidak meminta reset ini, mohon abaikan email ini</li>
                  </ul>
                </div>
              </div>
              <div class="footer">
                <p>Jika anda tidak meminta reset password, akun anda tetap aman dan tidak ada tindakan yang diperlukan.</p>
                <p>© 2024 CatatanQu. Semua hak cipta dilindungi.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });
    return data;
  } catch (error) {
    console.error(`Failed to send reset password email:`, error);
    throw error;
  }
};

export const sendWelcomeEmail = async (userName, receiverEmail) => {
  try {
    const data = await resend.emails.send({
      from: "CatatanQu <onboarding@resend.dev>",
      to: receiverEmail,
      subject: "Selamat Datang di CatatanQu!",
      html: `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #d4edda; padding: 20px; text-align: center; border-radius: 8px; border-left: 4px solid #28a745; }
              .content { padding: 20px 0; }
              .button {
                display: inline-block;
                padding: 12px 24px;
                background: #28a745;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
              }
              .footer { font-size: 12px; color: #666; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Selamat Datang di CatatanQu!</h1>
              </div>
              <div class="content">
                <p>Halo, ${userName},</p>
                <p>Selamat! Email anda sudah berhasil terverifikasi dan akun CatatanQu anda sekarang sudah aktif.</p>
                <p>Anda sekarang bisa mulai menggunakan semua fitur CatatanQu. Berikut fitur yang bisa anda gunakan:</p>
                <ul>
                  <li>Buat dan kelola catatan anda</li>
                  <li>Tuangkan dan organisir pikiran serta ide-ide anda</li>
                  <li>Akses akun anda dari mana saja</li>
                </ul>
                <p style="text-align: center;">
                  <a href="${process.env.FRONTEND_URL}/notes" class="button">Mulai Mencatat</a>
                </p>
                <p>Jika anda memiliki pertanyaan atau membutuhkan bantuan, jangan ragu untuk menghubungi tim dukungan kami.</p>
              </div>
              <div class="footer">
                <p>Terima kasih sudah memilih CatatanQu!</p>
                <p>© 2024 CatatanQu. Semua hak cipta dilindungi.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });
    return data;
  } catch (error) {
    console.error(`Failed to send welcome email:`, error);
    throw error;
  }
};

export const sendSessionAlertEmail = async (receiverEmail, sessionInfo) => {
  try {
    const data = await resend.emails.send({
      from: "CatatanQu <onboarding@resend.dev>",
      to: receiverEmail,
      subject: "Login Baru ke Akun CatatanQu Anda",
      html: `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #cce5ff; padding: 20px; text-align: center; border-radius: 8px; border-left: 4px solid #007bff; }
              .content { padding: 20px 0; }
              .info-box { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0; }
              .button {
                display: inline-block;
                padding: 12px 24px;
                background: #007bff;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
              }
              .footer { font-size: 12px; color: #666; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Pemberitahuan Login Baru</h1>
              </div>
              <div class="content">
                <p>Halo, ${receiverEmail},</p>
                <p>Kami mendeteksi login baru ke akun CatatanQu anda. Berikut adalah detailnya:</p>
                <div class="info-box">
                  <p><strong>Waktu:</strong> ${new Date().toLocaleString("id-ID")}</p>
                  <p><strong>Alamat IP:</strong> ${sessionInfo.ipAddress}</p>
                  <p><strong>Perangkat:</strong> ${sessionInfo.userAgent}</p>
                </div>
                <p>Jika ini adalah anda, tidak ada tindakan lebih lanjut yang diperlukan. Jika anda tidak mengenali login ini, mohon amankan akun anda segera.</p>
                <p style="text-align: center;">
                  <a href="${process.env.FRONTEND_URL}/settings/security" class="button">Kelola Pengaturan Keamanan</a>
                </p>
              </div>
              <div class="footer">
                <p>Tetap aman bersama CatatanQu!</p>
                <p>© 2024 CatatanQu. Semua hak cipta dilindungi.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });
    return data;
  } catch (error) {
    console.error(`Failed to send email chamged sessions:`, error);
    throw error;
  }
};

export const sendPasswordChangeConfirmationEmail = async (receiverEmail) => {
  try {
    const data = await resend.emails.send({
      from: "CatatanQu <onboarding@resend.dev>",
      to: receiverEmail,
      subject: "Password Berhasil Diubah",
      html: `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #d4edda; padding: 20px; text-align: center; border-radius: 8px; border-left: 4px solid #28a745; }
              .content { padding: 20px 0; }
              .button {
                display: inline-block;
                padding: 12px 24px;
                background: #28a745;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
              }
              .footer { font-size: 12px; color: #666; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Password Berhasil Diubah</h1>
              </div>
              <div class="content">
                <p>Halo, ${receiverEmail},</p>
                <p>Password anda telah berhasil diubah. Untuk alasan keamanan, semua sesi aktif anda telah dilogout.</p>
                <p>Anda perlu login kembali dengan password baru untuk mengakses akun anda.</p>
                <p style="text-align: center;">
                  <a href="${process.env.FRONTEND_URL}/auth/login" class="button">Login Sekarang</a>
                </p>
                <p>Jika anda tidak melakukan perubahan ini, mohon hubungi tim dukungan kami segera.</p>
              </div>
              <div class="footer">
                <p>Keamanan anda adalah prioritas kami.</p>
                <p>© 2024 CatatanQu. Semua hak cipta dilindungi.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });
    return data;
  } catch (error) {
    console.error(`Failed to send email confirm reset password:`, error);
    throw error;
  }
};
