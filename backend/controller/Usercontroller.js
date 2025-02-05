import express from "express";
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import validator from "validator";
import crypto from "crypto";
import userModel from "../models/Usermodel.js";
import transporter from "../config/nodemailer.js";

const backendurl = process.env.BACKEND_URL;

const createtoken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

dotenv.config();

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const Registeruser = await userModel.findOne({ email });
    if (!Registeruser) {
      return res.json({ message: "Email not found", success: false });
    }
    const isMatch = await bcrypt.compare(password, Registeruser.password);
    if (isMatch) {
      const token = createtoken(Registeruser._id);
      return res.json({
        token,
        user: { name: Registeruser.name, email: Registeruser.email },
        success: true,
      });
    } else {
      return res.json({ message: "Invalid password", success: false });
    }
  } catch (error) {
    console.error(error);
    res.json({ message: "Server error", success: false });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate email format
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ message: "Invalid email format", success: false });
    }

    // Check if email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Email already registered", success: false });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ name, email, password: hashedPassword });

    try {
      await newUser.save();
    } catch (saveError) {
      if (saveError.code === 11000) {
        // MongoDB duplicate key error
        return res
          .status(409)
          .json({ message: "Email already registered", success: false });
      }
      throw saveError;
    }

    const token = createtoken(newUser._id);

    // Send welcome email
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Welcome to BuildEstate - Your Account Has Been Created",
      html: `
      <div style="max-width: 600px; margin: 20px auto; padding: 0; background: #ffffff; border-radius: 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); font-family: 'Arial', sans-serif;">
          <!-- Header with Background -->
          <div style="background: linear-gradient(135deg, #2563eb, #1e40af); padding: 40px 20px; border-radius: 15px 15px 0 0; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Welcome to BuildEstate!</h1>
              <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0 0; font-size: 16px;">Your Premier Real Estate Platform</p>
          </div>
          <!-- Main Content -->
          <div style="padding: 40px 30px;">
              <p style="font-size: 16px; color: #444; line-height: 1.6; margin: 0 0 20px 0;">
                  Hello <strong style="color: #2563eb;">${name}</strong>,
              </p>
              <p style="font-size: 16px; color: #444; line-height: 1.6; margin: 0 0 20px 0;">
                  Thank you for joining BuildEstate! We're thrilled to welcome you to our community of property seekers and owners. Your account has been successfully created, and you're now ready to begin your real estate journey with us.
              </p>
              <!-- Feature Boxes -->
              <div style="margin: 30px 0; background: #f8fafc; border-radius: 10px; padding: 20px;">
                  <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">What you can do now:</h3>
                  <ul style="margin: 0; padding: 0 0 0 20px; color: #444;">
                      <li style="margin-bottom: 10px;">Browse exclusive property listings</li>
                      <li style="margin-bottom: 10px;">Save your favorite properties</li>
                      <li style="margin-bottom: 10px;">Connect with property owners</li>
                  </ul>
              </div>
              <!-- CTA Button -->
              <div style="text-align: center; margin: 35px 0;">
                  <a href="${process.env.WEBSITE_URL}/getting-started"
                     style="display: inline-block; padding: 16px 30px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-size: 18px; font-weight: bold; transition: background-color 0.3s ease; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);">
                      Get Started Now
                  </a>
              </div>
              <p style="font-size: 16px; color: #444; line-height: 1.6; margin: 0 0 20px 0;">
                  If you have any questions or need assistance, our dedicated support team is here to help you 24/7.
              </p>
              <!-- Support Box -->
              <div style="background: #f0f7ff; border-left: 4px solid #2563eb; padding: 15px; border-radius: 4px; margin: 25px 0;">
                  <p style="margin: 0; color: #444; font-size: 15px;">
                      📧 Email: support@buildestate.com<br>
                      ⏰ Response Time: Within 24 hours
                  </p>
              </div>
              <!-- Signature -->
              <p style="font-size: 16px; color: #444; line-height: 1.6; margin: 30px 0 0 0;">
                  Best regards,<br>
                  <strong style="color: #2563eb;">The BuildEstate Team</strong>
              </p>
          </div>
          <!-- Footer -->
          <div style="background: #f8fafc; padding: 20px; border-radius: 0 0 15px 15px; text-align: center;">
              <p style="margin: 0; color: #64748b; font-size: 14px;">
                  Follow us on social media for the latest updates
              </p>
              <div style="margin: 15px 0;">
                  <a href="#" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Twitter</a>
                  <a href="#" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Facebook</a>
                  <a href="#" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Instagram</a>
              </div>
              <p style="margin: 15px 0 0 0; color: #64748b; font-size: 13px;">
                  © 2025 BuildEstate. All rights reserved.
              </p>
          </div>
      </div>
      `,
    };
    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      token,
      user: { name: newUser.name, email: newUser.email },
      success: true,
      message: "Registration successful",
    });
  } catch (error) {
    console.error(error);

    // Handle email sending errors separately
    if (
      error.code === "EENVELOPE" ||
      error.code === "ECONNREFUSED" ||
      error.code === "ETIMEDOUT" ||
      error.code === "EAUTH"
    ) {
      console.log("Email service error:", error.message);
      // User was created but email failed
      return res.status(201).json({
        token,
        user: { name: newUser.name, email: newUser.email },
        message:
          "Account created successfully but welcome email could not be sent",
        success: true,
      });
    }

    return res.status(500).json({
      message: "An unexpected error occurred",
      success: false,
    });
  }
};

const adminlogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await userModel.findOne({ email, isAdmin: true });

    if (!admin) {
      return res
        .status(400)
        .json({ message: "Invalid admin credentials", success: false });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (isMatch) {
      const token = jwt.sign(
        { id: admin._id, isAdmin: true },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      return res.json({ token, success: true });
    } else {
      return res
        .status(400)
        .json({ message: "Invalid admin credentials", success: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Email not found", success: false });
    }
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpire = Date.now() + 10 * 60 * 1000; // 1 hour
    await user.save();
    const resetUrl = `${process.env.WEBSITE_URL}/reset/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset",
      html: `<div style="max-width: 600px; margin: 20px auto; padding: 20px; background: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    <h1 style="color: #333; text-align: center;">Reset Your Password</h1>
    <p style="font-size: 16px; color: #555;">Hello,</p>
    <p style="font-size: 16px; color: #555;">We received a request to reset your password for your BuildEstate account. Click the button below to reset it:</p>
    <div style="text-align: center; margin: 20px 0;">
        <a href="${resetUrl}"
           style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; font-size: 18px; font-weight: bold;">
            Reset Password
        </a>
    </div>
    <p style="font-size: 16px; color: #555;">If you didn't request a password reset, you can safely ignore this email. The link will expire in 10 minutes for your security.</p>
    <p style="font-size: 16px; color: #555;">For security reasons, please do not share this email with anyone.</p>
    <p style="font-size: 16px; color: #555;">Best regards,<br><strong>BuildEstate Security Team</strong></p>
</div>`,
    };
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Email sent", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

const resetpassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await userModel.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired token", success: false });
    }
    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();
    return res
      .status(200)
      .json({ message: "Password reset successful", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

const logout = async (req, res) => {
  try {
    return res.json({ message: "Logged out", success: true });
  } catch (error) {
    console.error(error);
    return res.json({ message: "Server error", success: false });
  }
};

const getname = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.json({ message: "Server error", success: false });
  }
};

export {
  login,
  register,
  forgotpassword,
  resetpassword,
  adminlogin,
  logout,
  getname,
};
