// Importar módulos
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const https = require('https');
const http = require('http');
const fs = require('fs');
const authRouter = require('./auth'); // Asegúrate de que la ruta sea correcta

const app = express();
const PORT = process.env.PORT || 4000;

// Cargar certificado SSL
const options = {
    key: fs.readFileSync('C:/Users/Moren/OneDrive/Documents/Tienda/clave.key'),
    cert: fs.readFileSync('C:/Users/Moren/OneDrive/Documents/Tienda/certificado.crt')
};


// Middleware
app.use(helmet()); // Proteger las cabeceras HTTP
app.use(cors());
app.use(bodyParser.json());

// Usar el router de autenticación
app.use('/api/usuarios', authRouter); // Cambia la ruta si es necesario

// Datos simulados de productos (puedes cambiar esto por datos de una base de datos)
const productos = [
    { id: 1, nombre: 'Producto 1', precio: 45.850, imagen: 'images/pr1.webp' },
    { id: 2, nombre: 'Producto 2', precio: 800.00, imagen: 'images/pr2.webp' },
    { id: 3, nombre: 'Producto 3', precio: 2030.00, imagen: 'images/pr3.webp' },
    { id: 4, nombre: 'Producto 4', precio: 2000.00, imagen: 'images/pr4.webp' },
    { id: 5, nombre: 'Producto 5', precio: 1555.00, imagen: 'images/pr5.webp' },
    { id: 6, nombre: 'Producto 6', precio: 955.00, imagen: 'images/pr6.webp' },
    { id: 7, nombre: 'Producto 7', precio: 15000.00, imagen: 'images/pr7.webp' },
    { id: 8, nombre: 'Producto 8', precio: 500.00, imagen: 'images/pr8.webp' },
];

// Carrito en memoria
let carrito = [];

// Ruta para obtener productos
app.get('/api/productos', (req, res) => {
    res.json(productos);
});

// Ruta para agregar productos al carrito
app.post('/api/carrito', (req, res) => {
    const { id } = req.body;
    const producto = productos.find(p => p.id === id);

    if (producto) {
        carrito.push(producto); // Agregar el producto al carrito
        return res.json({ mensaje: 'Producto agregado al carrito', carrito });
    }
    res.status(404).json({ mensaje: 'Producto no encontrado' });
});

// Ruta para obtener el carrito
app.get('/api/carrito', (req, res) => {
    res.json(carrito);
});

// Ruta para eliminar un producto del carrito
app.delete('/api/carrito/:id', (req, res) => {
    const { id } = req.params;
    carrito = carrito.filter(producto => producto.id != id); // Eliminar el producto
    res.json({ mensaje: 'Producto eliminado del carrito', carrito });
});

// Crear un servidor HTTPS
https.createServer(options, app).listen(PORT, () => {
    console.log(`Servidor HTTPS escuchando en puerto ${PORT}`);
});

// Crear un servidor HTTP que redirige a HTTPS
http.createServer((req, res) => {
    res.writeHead(301, { "Location": `https://${req.headers.host}${req.url}` });
    res.end();
}).listen(80); // Puerto 80 para HTTP

app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://trustedscripts.com"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
    }
}));
