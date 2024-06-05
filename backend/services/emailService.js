const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async ({ name, email, phone, message }) => {
  const mailOptions = {
    from: `${name} <${email}>`,
    to: process.env.RECEIVER_EMAIL,
    subject: "Contact form details",
    html: `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .container { width: 50%; margin: 0 auto; }
          .header img { display: block; margin: 15px auto; }
          .content { border-top: 1px solid #dfdfdf; padding: 7px 0; }
          .content p { margin: 5px 0; }
          .content .label { font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="http://www.yourdomain.com/images/logo-email.png" alt="Logo">
          </div>
          <div class="content">
            <p><span class="label">Name:</span> ${name}</p>
            <p><span class="label">Email:</span> ${email}</p>
            <p><span class="label">Phone:</span> ${phone}</p>
            <p><span class="label">Message:</span><br>${message.replace(
              /\n/g,
              "<br>"
            )}</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
