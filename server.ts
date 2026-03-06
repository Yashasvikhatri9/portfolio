import express from "express";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

// Fallback: Manually parse .env.example if it exists and variables are missing
// This is to help users who put secrets in .env.example instead of the Secrets panel
try {
  const envExamplePath = path.resolve(process.cwd(), ".env.example");
  if (fs.existsSync(envExamplePath)) {
    const content = fs.readFileSync(envExamplePath, "utf-8");
    content.split("\n").forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || "";
        if (value.length > 0 && value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        }
        process.env[`${key}_FALLBACK`] = value;
      }
    });
  }
} catch (e) {
  console.error("Error loading .env.example fallback:", e);
}

async function createServer() {
  const app = express();
  app.use(express.json());

  // API routes
  app.post("/api/contact", async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if SMTP credentials are provided
    const smtpHost = process.env.SMTP_HOST || process.env.SMTP_HOST_FALLBACK;
    const smtpPort = process.env.SMTP_PORT || process.env.SMTP_PORT_FALLBACK;
    const smtpUser = process.env.SMTP_USER || process.env.SMTP_USER_FALLBACK;
    const smtpPass = process.env.SMTP_PASS || process.env.SMTP_PASS_FALLBACK;
    const toEmail = process.env.CONTACT_EMAIL || process.env.CONTACT_EMAIL_FALLBACK || "yashasvi.khatri05@gmail.com";

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
      console.error("SMTP credentials not configured. Please add them to the Secrets panel.");
      return res.status(500).json({ error: "Email service not configured. Please contact the administrator." });
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
        // Add timeout to prevent hanging
        connectionTimeout: 10000,
      });

      // Verify connection configuration
      await transporter.verify();

      await transporter.sendMail({
        from: `"${name}" <${smtpUser}>`,
        to: toEmail,
        replyTo: email,
        subject: `New Portfolio Message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">New Message from Portfolio</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
          </div>
        `,
      });

      res.json({ success: true });
    } catch (error: any) {
      console.error("Detailed SMTP Error:", error);
      
      // Provide more specific error messages to the frontend for debugging
      let errorMessage = "Failed to send message";
      if (error.code === 'EAUTH') {
        errorMessage = "Authentication failed. Please check your App Password.";
      } else if (error.code === 'ESOCKET' || error.code === 'ETIMEDOUT') {
        errorMessage = "Connection to email server timed out. Check your SMTP_HOST and SMTP_PORT.";
      }
      
      res.status(500).json({ error: errorMessage, details: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    // On Vercel, static files are handled by the platform, 
    // but this keeps it working locally/elsewhere
    app.use(express.static("dist"));
  }

  return app;
}

// Start server if not running as a module (e.g., on Vercel)
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  createServer().then(app => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
      console.log("Environment Variable Status:");
      console.log("- SMTP_HOST:", process.env.SMTP_HOST ? "✅ Set" : "❌ Missing");
      console.log("- SMTP_PORT:", process.env.SMTP_PORT ? "✅ Set" : "❌ Missing");
      console.log("- SMTP_USER:", process.env.SMTP_USER ? "✅ Set" : "❌ Missing");
      console.log("- SMTP_PASS:", process.env.SMTP_PASS ? "✅ Set" : "❌ Missing");
      console.log("- CONTACT_EMAIL:", process.env.CONTACT_EMAIL ? "✅ Set" : "❌ Missing (Using default)");
    });
  });
}

export default createServer;
