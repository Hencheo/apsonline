require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const basicAuth = require('express-basic-auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Set up security auth for admin
const adminUser = process.env.ADMIN_USER;
const adminPass = process.env.ADMIN_PASS;

if (!adminUser || !adminPass) {
    console.warn("⚠️ AVISO DE SEGURANÇA: Credenciais de admin não definidas no .env. Usando admin/aps@admin123 (NÃO RECOMENDADO PARA PRODUÇÃO).");
}

const authMiddleware = basicAuth({
    users: { [adminUser || 'admin']: adminPass || 'aps@admin123' },
    challenge: true,
    realm: 'Area Administrativa APS'
});

// 1. Proteger Rota do Frontend do Admin (deve vir antes do static middleware)
app.use('/admin.html', authMiddleware);

// 2. Servir arquivos estáticos (exceto os protegidos nativamente acima)
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

// GET all events (Público, consumido pela página principal)
app.get('/api/events', (req, res) => {
    fs.readFile(EVENTS_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading database.');
        res.json(JSON.parse(data));
    });
});

// POST update events (Save all) - PROTEGIDO
app.post('/api/events', authMiddleware, (req, res) => {
    const events = req.body;
    fs.writeFile(EVENTS_FILE, JSON.stringify(events, null, 2), (err) => {
        if (err) return res.status(500).send('Error saving database.');
        res.status(200).send('Database updated successfully.');
    });
});

// POST Upload Image - PROTEGIDO
app.post('/api/upload', authMiddleware, upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');
    const filePath = `apsonline.com.br/assets/${req.file.filename}`;
    res.json({ filePath: filePath });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Admin panel available at http://localhost:${PORT}/admin.html`);
});
