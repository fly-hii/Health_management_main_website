'use strict'
/**
 * emailService.js
 * Shared Nodemailer email utility for the CarePlus Marketing Website Backend.
 * Handles OTP delivery and password reset emails.
 */

const nodemailer = require('nodemailer')

let _transporter = null

const getTransporter = async () => {
  if (_transporter) return _transporter

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    _transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
  } else {
    // Fallback to Ethereal test account for dev without SMTP config
    const testAccount = await nodemailer.createTestAccount()
    _transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email', port: 587, secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    })
    console.log('📧 Ethereal test email account:', testAccount.user)
  }

  return _transporter
}

const FROM = () => process.env.SMTP_FROM || `"CarePlus HMS" <${process.env.SMTP_USER || 'no-reply@careplus.com'}>`

// ── OTP Email ──────────────────────────────────────────────────────────────
const sendOtpEmail = async (to, name, otp, purpose = 'login') => {
  const transporter = await getTransporter()

  const isLogin = purpose === 'login'
  const subject = isLogin
    ? '[CarePlus] Your Sign-In OTP'
    : '[CarePlus] Your Password Reset OTP'
  const actionText = isLogin
    ? 'We received a sign-in request for your CarePlus account. Use the OTP below to complete your login.'
    : 'We received a request to reset your CarePlus account password. Use the OTP below.'

  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Segoe UI',Helvetica,Arial,sans-serif;background:#f0f4f8;}
  .wrapper{max-width:560px;margin:36px auto;background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 6px 32px rgba(0,0,0,0.09);}
  .header{background:linear-gradient(135deg,#0B1F3A 0%,#0F9D8A 100%);padding:34px 40px;text-align:center;}
  .logo{font-size:26px;font-weight:900;color:#fff;letter-spacing:-1px;}
  .logo span{color:#5EEAD4;}
  .body{padding:36px 40px;}
  .greeting{font-size:17px;font-weight:700;color:#0B1F3A;margin-bottom:8px;}
  .intro{font-size:14px;color:#475569;line-height:1.7;margin-bottom:24px;}
  .otp-box{background:linear-gradient(135deg,#f0fdf9,#ecfdf5);border:2px dashed #0F9D8A;border-radius:14px;text-align:center;padding:24px 20px;margin:0 0 20px;}
  .otp-label{font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:10px;}
  .otp-code{font-size:46px;font-weight:900;color:#0F9D8A;letter-spacing:14px;font-family:'Courier New',monospace;}
  .otp-expire{font-size:12px;color:#94a3b8;margin-top:10px;}
  .alert{background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:14px 18px;margin-bottom:16px;}
  .alert p{font-size:13px;color:#92400e;line-height:1.6;}
  .footer{background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 40px;text-align:center;}
  .footer p{font-size:11px;color:#94a3b8;line-height:1.9;}
</style></head>
<body><div class="wrapper">
  <div class="header"><div class="logo">Care<span>Plus</span> HMS</div></div>
  <div class="body">
    <p class="greeting">Hello${name ? `, ${name}` : ''}!</p>
    <p class="intro">${actionText}</p>
    <div class="otp-box">
      <div class="otp-label">Your One-Time Password</div>
      <div class="otp-code">${otp}</div>
      <div class="otp-expire">⏱ Expires in <strong>10 minutes</strong></div>
    </div>
    <div class="alert"><p>🔒 <strong>Security Notice:</strong> Never share this OTP with anyone. CarePlus staff will never ask for your OTP. If you did not request this, please ignore this email.</p></div>
  </div>
  <div class="footer">
    <p>© ${new Date().getFullYear()} CarePlus Healthcare Systems Pvt. Ltd. All rights reserved.</p>
    <p>This is an automated email — please do not reply.</p>
  </div>
</div></body></html>`

  const info = await transporter.sendMail({
    from: FROM(),
    to,
    subject,
    html,
  })

  if (!process.env.SMTP_HOST) {
    console.log(`📧 OTP email preview: ${nodemailer.getTestMessageUrl(info)}`)
  }
  console.log(`📨 OTP email sent → ${to}`)
  return info
}

// ── Password Reset Email ───────────────────────────────────────────────────
const sendPasswordResetEmail = async (to, name, resetToken) => {
  const transporter = await getTransporter()

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000'
  const resetLink = `${clientUrl}/reset-password?token=${resetToken}`

  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Segoe UI',Helvetica,Arial,sans-serif;background:#f0f4f8;}
  .wrapper{max-width:560px;margin:36px auto;background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 6px 32px rgba(0,0,0,0.09);}
  .header{background:linear-gradient(135deg,#0B1F3A 0%,#0F9D8A 100%);padding:34px 40px;text-align:center;}
  .logo{font-size:26px;font-weight:900;color:#fff;letter-spacing:-1px;}
  .logo span{color:#5EEAD4;}
  .body{padding:36px 40px;}
  .greeting{font-size:17px;font-weight:700;color:#0B1F3A;margin-bottom:8px;}
  .intro{font-size:14px;color:#475569;line-height:1.7;margin-bottom:24px;}
  .cta-btn{display:block;padding:16px;background:linear-gradient(135deg,#0F9D8A,#0B7A70);color:#fff !important;text-align:center;text-decoration:none;border-radius:12px;font-size:15px;font-weight:800;margin-bottom:20px;}
  .token-box{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px 18px;margin-bottom:20px;word-break:break-all;}
  .token-label{font-size:10px;color:#94a3b8;text-transform:uppercase;font-weight:700;letter-spacing:0.07em;margin-bottom:6px;}
  .token-val{font-size:12px;color:#334155;font-family:'Courier New',monospace;font-weight:700;}
  .alert{background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:14px 18px;margin-bottom:16px;}
  .alert p{font-size:13px;color:#92400e;line-height:1.6;}
  .footer{background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 40px;text-align:center;}
  .footer p{font-size:11px;color:#94a3b8;line-height:1.9;}
</style></head>
<body><div class="wrapper">
  <div class="header"><div class="logo">Care<span>Plus</span> HMS</div></div>
  <div class="body">
    <p class="greeting">Hello${name ? `, ${name}` : ''}!</p>
    <p class="intro">We received a request to reset your <strong>CarePlus</strong> account password. Click the button below to set a new password. This link is valid for <strong>30 minutes</strong>.</p>
    <a href="${resetLink}" class="cta-btn">🔑 Reset My Password →</a>
    <div class="token-box">
      <div class="token-label">Or paste this link in your browser</div>
      <div class="token-val">${resetLink}</div>
    </div>
    <div class="alert"><p>🔒 <strong>Security Notice:</strong> If you did not request a password reset, please ignore this email. Your password will not change. Contact support if you suspect unauthorized access.</p></div>
  </div>
  <div class="footer">
    <p>© ${new Date().getFullYear()} CarePlus Healthcare Systems Pvt. Ltd. All rights reserved.</p>
    <p>This link expires in 30 minutes. Do not share it with anyone.</p>
  </div>
</div></body></html>`

  const info = await transporter.sendMail({
    from: FROM(),
    to,
    subject: '[CarePlus] Reset Your Password',
    html,
  })

  if (!process.env.SMTP_HOST) {
    console.log(`📧 Password reset email preview: ${nodemailer.getTestMessageUrl(info)}`)
  }
  console.log(`📨 Password reset email sent → ${to}`)
  return info
}

module.exports = { sendOtpEmail, sendPasswordResetEmail }
