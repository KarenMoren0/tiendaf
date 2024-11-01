const express = require('express'); 
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const fs = require('fs');
const https = require('https');
const http = require('http');
const authRouter = require('./middleware/auth');
const productosRouter = require('../routes/productos'); // Asegúrate de que la ruta sea correcta
const sequelize = require('../config/database');
const { authenticateToken, authorizeRole } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

// Usar los routers
app.use('/api/usuarios', authRouter); 
app.use('/api/productos', productosRouter); // Asegúrate de que productosRouter esté definido

// Ejemplo de ruta protegida
app.get('/api/protected', authenticateToken, (req, res) => {
    res.json({ message: 'Ruta protegida', user: req.user });
});

// Ruta solo para administradores
app.get('/api/admin', authenticateToken, authorizeRole('admin'), (req, res) => {
    res.json({ message: 'Solo accesible por administradores' });
});

// Sincronizar la base de datos y crear un servidor HTTPS
sequelize.sync().then(() => {
    https.createServer(options, app).listen(PORT, () => {
        console.log(`Servidor HTTPS escuchando en puerto ${PORT}`);
    });

    // Crear un servidor HTTP que redirige a HTTPS
    http.createServer((req, res) => {
        res.writeHead(301, { "Location": `https://${req.headers.host}${req.url}` });
        res.end();
    }).listen(80); // Puerto 80 para HTTP
}).catch(err => console.log('Error al sincronizar la base de datos:', err));

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});
