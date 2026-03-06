import nodemailer from "nodemailer";

export default async function handler(req: any, res: any) {
  // CORS headers for Vercel
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const smtpHost = process.env.SMTP_HOST || process.env.SMTP_HOST_FALLBACK;
  const smtpPort = process.env.SMTP_PORT || process.env.SMTP_PORT_FALLBACK;
  const smtpUser = process.env.SMTP_USER || process.env.SMTP_USER_FALLBACK;
  const smtpPass = process.env.SMTP_PASS || process.env.SMTP_PASS_FALLBACK;
  const toEmail = process.env.CONTACT_EMAIL || process.env.CONTACT_EMAIL_FALLBACK || "yashasvi.khatri05@gmail.com";

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    return res.status(500).json({ error: "Email service not configured. Please add them to Vercel Environment Variables." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: smtpHost.includes("gmail") ? "gmail" : undefined,
      host: smtpHost,
      port: parseInt(smtpPort),
      secure: parseInt(smtpPort) === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      connectionTimeout: 10000,
    });

    await transporter.verify();

    await transporter.sendMail({
      from: `"${name}" <${smtpUser}>`,
      to: toEmail,
      replyTo: email,
      subject: `New Portfolio Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Detailed SMTP Error:", error);
    let errorMessage = "Failed to send message";
    if (error.code === 'EAUTH') {
      errorMessage = "Authentication failed. Please check your App Password in Vercel.";
    } else if (error.code === 'ESOCKET' || error.code === 'ETIMEDOUT') {
      errorMessage = "Connection to email server timed out. Check your SMTP_HOST and SMTP_PORT.";
    }
    res.status(500).json({ error: errorMessage, details: error.message });
  }
}
