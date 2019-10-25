const nodemailer = require('nodemailer');


async function sendEmail(to, subject, text) {
	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'noreply.project09@gmail.com',
			pass: process.env.EMPASSWORD
		}
	});
	
	var mailOptions = {
		from: '"Team Keep Notes" <noreply.project09@gmail.com>',
		to: to,
		subject: subject,
		html: text
	};
	
	await transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			console.log(error)
			return false
		} else {
			console.log("Success")
			return true
		}
	});
}

module.exports.sendEmail = sendEmail;