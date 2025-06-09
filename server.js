const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static(__dirname));

// تأكد إن مجلد uploads موجود، ولو مش موجود نعمله
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.post('/api/upload', async (req, res) => {
  const imageData = req.body.image;

  // إنشاء اسم عشوائي للصورة باستخدام التاريخ والزمن
  const fileName = `photo_${Date.now()}.jpg`;
  const filePath = path.join(uploadDir, fileName);

  // استخراج البيانات بعد base64
  const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, 'base64');

  // حفظ الصورة
  fs.writeFile(filePath, buffer, (err) => {
    if (err) {
      console.error('Error saving image:', err);
      return res.sendStatus(500);
    }
    console.log('Image saved:', fileName);
    res.sendStatus(200);
  });
});

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
