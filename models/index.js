// index.js

const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sequelize, Usuario, Producto, Pedido } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Secreto para JWT
const JWT_SECRET = 'tu_secreto_jwt_aqui'; // Cambia esto por un valor seguro

// Ruta de registro
app.post('/registro', async (req, res) => {
    const { nombre, email, contraseña } = req.body;
    const hashedPassword = bcrypt.hashSync(contraseña, 8); // Encriptar la contraseña
    try {
        const nuevoUsuario = await Usuario.create({ nombre, email, contraseña: hashedPassword });
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

// Ruta de inicio de sesión
app.post('/login', async (req, res) => {
    const { email, contraseña } = req.body;
    try {
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        const passwordIsValid = bcrypt.compareSync(contraseña, usuario.contraseña);
        if (!passwordIsValid) {
            return res.status(401).json({ accessToken: null, message: 'Contraseña incorrecta' });
        }
        const token = jwt.sign({ id: usuario.id }, JWT_SECRET, { expiresIn: 86400 }); // 24 horas
        res.status(200).json({ id: usuario.id, email: usuario.email, accessToken: token });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

// Middleware de autenticación
const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(403);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Ruta protegida para agregar productos al carrito
app.post('/carrito', authenticateJWT, async (req, res) => {
    const { productos } = req.body; // Asegúrate de que 'productos' es un array de IDs de productos
    const usuarioId = req.user.id; // ID del usuario autenticado
    try {
        const nuevoPedido = await Pedido.create({ usuarioId });
        await nuevoPedido.addProductos(productos);
        res.status(201).json(nuevoPedido);
    } catch (error) {
        console.error('Error al gestionar el carrito:', error);
        res.status(500).json({ error: 'Error al gestionar el carrito' });
    }
});

// Sincronizar la base de datos y empezar el servidor
sequelize.sync()
    .then(() => {
        console.log("Base de datos sincronizada");
        app.listen(PORT, () => {
            console.log(`Servidor escuchando en el puerto ${PORT}`);
        });
    })
    .catch(error => console.error("Error al sincronizar la base de datos:", error));
    nodeserver.js