const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

const EVENTS_FILE = path.join(__dirname, 'events.json');
const UPLOAD_DIR = path.join(__dirname, 'apsonline.com.br/assets');

// Multer Config for Image Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// GET all events
app.get('/api/events', (req, res) => {
    fs.readFile(EVENTS_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading database.');
        res.json(JSON.parse(data));
    });
});

// POST update events (Save all)
app.post('/api/events', (req, res) => {
    const events = req.body;
    fs.writeFile(EVENTS_FILE, JSON.stringify(events, null, 2), (err) => {
        if (err) return res.status(500).send('Error saving database.');
        res.status(200).send('Database updated successfully.');
    });
});

// POST Upload Image
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');
    const filePath = `apsonline.com.br/assets/${req.file.filename}`;
    res.json({ filePath: filePath });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Admin panel available at http://localhost:${PORT}/admin.html`);
});
