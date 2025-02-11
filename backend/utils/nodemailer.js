import nodemailer from 'nodemailer';
import dotenv from "dotenv"
dotenv.config()

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.SENDER_MAIL,
        pass: process.env.SMTP_PASSWORD
    }
});

export default transporter
