const Contact = require("../models/Contact");
const { sendEmail } = require("../services/emailService");
const { successResponse, errorResponse } = require("../utils/responseHandler");

exports.handleContactForm = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    console.log("Received contact form data", req.body);

    // Save to database
    const newContact = new Contact({ name, email, phone, message });
    await newContact.save();

    // Send email, non-blocking operation
    sendEmail({ name, email, phone, message })
      .then(() => {
        console.log("Email sent successfully");
      })
      .catch((error) => {
        console.error("Failed to send email", error);
      });

    return successResponse(res, "Your message has been sent successfully!");
  } catch (error) {
    console.error("Failed to send message", error);
    return errorResponse(res, "Failed to send your message.");
  }
};
