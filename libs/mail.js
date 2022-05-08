

const nodemailer = require('nodemailer');

module.exports.sendMail = async (to, subject, body) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'auction.20hcb@gmail.com',
      pass: '20hcb2.2021'
    }
  });

  const mailOptions = {
    from: 'auction.20hcb@gmail.com',
    to: to,
    subject: subject,
    text: '',
    html: body
  };

  const result = await new Promise((solve) => {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        solve(false);
      } else {
        solve(true);
      }
    });
  })

  return result;
}