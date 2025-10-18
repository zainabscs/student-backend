import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // Quick check endpoint: if GET, just respond with a running message
  if (req.method === "GET") {
    return res.status(200).json({ message: "Backend is running ✅" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const {
      name, email, phone, city,
      year_of_passing, qualification,
      ielts, country, budget, message
    } = req.body;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      replyTo: email,
      subject: "🎓 New Student Profile Evaluation Submission",
      text: `
A new profile evaluation request has been submitted:

Name: ${name}
Email: ${email}
Phone: ${phone}
City: ${city}
Qualification: ${qualification}
Year of Passing: ${year_of_passing}
IELTS / PTE Score: ${ielts}
Preferred Country: ${country}
Budget (PKR): ${budget}

Message:
${message}
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Form submitted and email sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error, email not sent." });
  }
}
