const express = require('express');
const path = require('path');

// Swagger Kütüphaneleri (7. Adım)
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



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

// MVC Rotaları (Routes Katmanı)
const apiUserRoutes = require('./routes/apiUserRoutes');
const userRoutes = require('./routes/userRoutes');

// Rotaları Express'e bağlama
app.use('/api/users', apiUserRoutes);
app.use('/users', userRoutes);

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
