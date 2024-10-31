const express = require('express');
const router = express.Router();
const { Usuario, Producto, Pedido } = require('./models'); // Importa tus modelos
const auth = require('./auth'); // Asegúrate de importar correctamente tu archivo de autenticación
const csurf = require('csurf');

// Crear el middleware para CSRF
const csrfProtection = csurf({ cookie: true });

// Rutas para usuarios
// Registrar un nuevo usuario
router.post('/api/usuarios', auth.register); // Ahora usa el método de autenticación

// Iniciar sesión
router.post('/api/usuarios/login', auth.login); // Ahora usa el método de autenticación

// Rutas para productos
// Obtener todos los productos
router.get('/api/productos', async (req, res) => {
    try {
        const productos = await Producto.findAll();
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos', detalles: error });
    }
});

// Crear un nuevo producto
router.post('/api/productos', async (req, res) => {
    try {
        const { nombre, precio, imagen } = req.body;
        const nuevoProducto = await Producto.create({ nombre, precio, imagen });
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear producto', detalles: error });
    }
});

// Rutas para pedidos
// Crear un nuevo pedido (protegida por autenticación y CSRF)
router.post('/api/pedidos', auth.authenticateJWT, csrfProtection, async (req, res) => {
    try {
        const { usuarioId, productos } = req.body; // Asegúrate de que el usuario está autenticado
        const nuevoPedido = await Pedido.create({ usuarioId });

        // Asocia los productos con el pedido
        await nuevoPedido.addProductos(productos);
        
        res.status(201).json(nuevoPedido);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear pedido', detalles: error });
    }
});

// Obtener todos los pedidos de un usuario (protegida por autenticación)
router.get('/api/pedidos/:usuarioId', auth.authenticateJWT, async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const pedidos = await Pedido.findAll({ where: { usuarioId } });
        res.status(200).json(pedidos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener pedidos', detalles: error });
    }
});

// Exportar el router
module.exports = router;
