import Appointment from "../models/appointmentModel.js";
import transporter from "../config/nodemailer.js";

export const scheduleViewing = async (req, res) => {
  try {
    const { propertyId, date, time, notes } = req.body;
    const userId = req.user._id; // From auth middleware

    const appointment = new Appointment({
      propertyId,
      userId,
      date,
      time,
      notes,
    });

    await appointment.save();

    // Send confirmation email
    const mailOptions = {
      from: process.env.EMAIL,
      to: req.user.email,
      subject: "Viewing Scheduled - BuildEstate",
      html: `
        <div style="max-width: 600px; margin: 20px auto; padding: 30px; background: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #2563eb; font-size: 24px; margin: 0 0 10px;">Viewing Scheduled Successfully!</h1>
    <div style="width: 50px; height: 2px; background: #2563eb; margin: 0 auto;"></div>
  </div>
  
  <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p style="font-size: 16px; color: #1f2937; margin-bottom: 15px;">Your property viewing has been scheduled for:</p>
    <p style="font-size: 18px; color: #2563eb; margin: 5px 0;">
      <strong>Date:</strong> ${new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })}
    </p>
    <p style="font-size: 18px; color: #2563eb; margin: 5px 0;">
      <strong>Time:</strong> ${time}
    </p>
  </div>

  <p style="color: #4b5563; line-height: 1.6;">
    We'll contact you shortly to confirm the appointment. If you need to make any changes, please contact our support team.
  </p>
</div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Viewing scheduled successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error scheduling viewing",
    });
  }
};
