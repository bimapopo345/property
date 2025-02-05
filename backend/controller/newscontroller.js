import News from "../models/newsmodel.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import transporter from "../config/nodemailer.js";

const submitNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    const newNewsletter = new News({
      email,
    });

    const savedNewsletter = await newNewsletter.save();

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Newsletter Subscription",
      html: `<div style="max-width: 600px; margin: 20px auto; padding: 20px; background: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    <h1 style="color: #333; text-align: center;">Welcome to BuildEstate Newsletter!</h1>
    <p style="font-size: 16px; color: #555;">Hello <strong>${email}</strong>,</p>
    <p style="font-size: 16px; color: #555;">Thank you for subscribing to our newsletter! You'll now receive the latest updates about new properties, real estate trends, and exclusive offers.</p>
    <div style="text-align: center; margin: 20px 0;">
        <a href="${process.env.WEBSITE_URL}"
           style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; font-size: 18px; font-weight: bold;">
            Visit Our Website
        </a>
    </div>
    <p style="font-size: 16px; color: #555;">To ensure you don't miss any updates, please add us to your contact list.</p>
    <p style="font-size: 16px; color: #555;">You can unsubscribe at any time by clicking the unsubscribe link at the bottom of our emails.</p>
    <p style="font-size: 16px; color: #555;">Best regards,<br><strong>BuildEstate</strong></p>
</div>`,
    };
    await transporter.sendMail(mailOptions);

    res.json({ message: "Newsletter submitted successfully" });
  } catch (error) {
    console.error("Error saving newsletter data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { submitNewsletter };

