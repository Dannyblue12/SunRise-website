const nodemailer = require("nodemailer")

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" })
  }

  const { name, email, subject, message } = req.body

  // Validate required fields
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    })
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address",
    })
  }

  const transporter = nodemailer.createTransporter({
    host: "smtp.hostinger.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || "info@streamofgracechapel.org",
      pass: process.env.EMAIL_PASS || "10DayAIChallenge@", // Use environment variable
    },
  })

  try {
    await transporter.sendMail({
      from: `"${name}" <${email}>`, // Fixed template literal syntax
      to: "info@streamofgracechapel.org",
      subject: subject,
      html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
    })

    res.status(200).json({
      success: true,
      message: "Message sent successfully!",
    })
  } catch (error) {
    console.error("Email sending failed:", error.message)
    res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
    })
  }
}
