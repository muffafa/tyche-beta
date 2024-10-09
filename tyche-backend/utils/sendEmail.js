import nodemailer from "nodemailer";

const sendEmail = async (options) => {
	const transporter = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		secure: process.env.EMAIL_PORT == 465,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});

	const message = {
		from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
		to: options.email,
		subject: options.subject,
		text: options.message,
	};

	const info = await transporter.sendMail(message);

	console.log("Message sent: %s", info.messageId);
};

export default sendEmail;
