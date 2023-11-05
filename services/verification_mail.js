const nodemailer = require("nodemailer");


exports.verification_mail = (email, token,name) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Email Verification",
        text: `Hello ${name}, Thank you for registering as a doctor. Please click on the link below to verify your email address.`,
        html: `<p>Hello ${name},</p> <p>Thank you for registering as a doctor.</p> <p>Please click on the link below to verify your email address:</p>
        <a href='http://localhost:3000/verify/${token}'>http://localhost:3000/verify/${token}</a>`
        // html: `Please click this link to verify your email: <a href="http://localhost:3000/verify/${token}">Verify Email</a>`
    };
     transporter.sendMail(mailOptions);
};