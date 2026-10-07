const express = require('express');
const path = require('path');

// Swagger Kütüphaneleri (7. Adım)
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

// Gerçek bir veritabanımız olmadığı için geçici veriler (RAM)
let users = [
    {
        id: 1,
        name: "Çağrı Akpınar",
        graduationYear: 2024,
        department: "Yönetim Bilişim Sistemleri",
        company: "Microsoft",
        jobTitle: "Software Engineer",
        skills: ["Node.js", "React"]
    },
    {
        id: 2,
        name: "Tonay Culha",
        graduationYear: 2023,
        department: "Yönetim Bilişim Sistemleri",
        company: "Amazon",
        jobTitle: "Data Scientist",
        skills: ["Python", "SQL"]
    }
];

// 2. Hafta - Ana Sayfa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 1. ADIM: Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: "success",
        message: "Server is healthy and running!"
    });
});

// 3. ADIM: Kullanıcı Ekle (POST)
app.post('/api/users', (req, res) => {
    const yeniKullanici = req.body;
    // Maksimum ID'yi bulup 1 ekliyoruz ki silinmelerde sorun çıkmasın
    const maxId = users.length > 0 ? Math.max(...users.map(u => u.id)) : 0;
    yeniKullanici.id = maxId + 1;
    users.push(yeniKullanici);
    res.status(201).json({
        message: "Kullanıcı başarıyla eklendi!",
        data: yeniKullanici
    });
});

// 4. ADIM: Tüm Kullanıcıları Getir (GET)
app.get('/api/users', (req, res) => {
    res.json(users);
});

// 4b ADIMI: Tek Kullanıcı Getir (GET by ID)
app.get('/api/users/:id', (req, res) => {
    const istenenId = parseInt(req.params.id);
    const bulunanKullanici = users.find(u => u.id === istenenId);
    if (bulunanKullanici) {
        res.json(bulunanKullanici);
    } else {
        res.status(404).json({ message: "Kullanıcı bulunamadı!" });
    }
});

// 5. ADIM: Kullanıcı Güncelle (PUT - Tam Değiştirme)
app.put('/api/users/:id', (req, res) => {
    const istenenId = parseInt(req.params.id);
    const guncelBilgiler = req.body;
    const index = users.findIndex(u => u.id === istenenId);
    
    if (index !== -1) {
        users[index] = { id: istenenId, ...guncelBilgiler };
        res.json({
            message: "Kullanıcı başarıyla güncellendi! (PUT)",
            user: users[index]
        });
    } else {
        res.status(404).json({ message: "Güncellenecek kullanıcı bulunamadı!" });
    }
});

// 5b. ADIM: Kullanıcı Kısmi Güncelle (PATCH - Kısmi Değiştirme)
app.patch('/api/users/:id', (req, res) => {
    const istenenId = parseInt(req.params.id);
    const kismiBilgiler = req.body;
    const index = users.findIndex(u => u.id === istenenId);

    if (index !== -1) {
        // Var olan bilgileri koruyup sadece gelen alanları güncelliyoruz
        users[index] = { ...users[index], ...kismiBilgiler, id: istenenId };
        res.json({
            message: "Kullanıcı kısmi olarak güncellendi! (PATCH)",
            user: users[index]
        });
    } else {
        res.status(404).json({ message: "Güncellenecek kullanıcı bulunamadı!" });
    }
});

// 6. ADIM: Kullanıcı Sil (DELETE)
app.delete('/api/users/:id', (req, res) => {
    const istenenId = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === istenenId);
    
    if (index !== -1) {
        const silinenKullanici = users.splice(index, 1);
        res.json({
            message: "Kullanıcı sistemden başarıyla silindi!",
            deletedUser: silinenKullanici[0]
        });
    } else {
        res.status(404).json({ message: "Silinecek kullanıcı bulunamadı!" });
    }
});

// 7. ADIM: Swagger API Dokümantasyonu
app.use('/api/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// /swagger adresine girilirse otomatik olarak /api/swagger'a yönlendir
app.get('/swagger', (req, res) => {
    res.redirect('/api/swagger');
});

// 2. Hafta Diğer API'ler
app.get('/hello', (req, res) => res.send("Hello, World!"));
app.get('/hello/:name', (req, res) => {
    const name = req.params.name;
    res.send(`Hello, ${name.charAt(0).toUpperCase() + name.slice(1)}!`);
});
app.get('/sum/:number1/:number2', (req, res) => {
    const num1 = parseFloat(req.params.number1);
    const num2 = parseFloat(req.params.number2);
    res.send(`Sonuç: ${num1 + num2}`);
});
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.listen(port, () => {
    console.log(`Sunucu çalışıyor: http://localhost:${port}`);
    console.log(`Swagger dokümantasyonu için: http://localhost:${port}/api/swagger`);
});
