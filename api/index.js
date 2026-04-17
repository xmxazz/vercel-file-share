const express = require('express');
const multer = require('multer');
const app = express();

// 内存存储
const storage = multer.memoryStorage();
const upload = multer({ storage });
const fileDB = new Map();

// 静态网页
app.use(express.static('public'));

// 上传接口
app.post('/upload', upload.single('file'), (req, res) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    fileDB.set(code, {
        buffer: req.file.buffer,
        name: req.file.originalname
    });
    res.json({ code });
});

// 下载接口
app.get('/download/:code', (req, res) => {
    const data = fileDB.get(req.params.code);
    if (!data) return res.status(404).send("取件码无效");

    res.setHeader('Content-Disposition', `attachment; filename="${data.name}"`);
    res.send(data.buffer);
});

module.exports = app;