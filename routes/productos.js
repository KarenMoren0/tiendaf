const express = require('express');
const router = express.Router();

// Datos de productos (pueden venir de la base de datos en un caso real)
const productos = [
    { id: 1, nombre: 'Producto 1', precio: 45.85, imagen: 'images/pr1.webp' },
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
router.get('/', (req, res) => {
    res.json(productos);
});

// Ruta para agregar productos al carrito
router.post('/carrito', (req, res) => {
    const { id } = req.body;
    const producto = productos.find(p => p.id === id);

    if (producto) {
        carrito.push(producto); // Agregar el producto al carrito
        return res.json({ mensaje: 'Producto agregado al carrito', carrito });
    }
    res.status(404).json({ mensaje: 'Producto no encontrado' });
});

// Ruta para obtener el carrito
router.get('/carrito', (req, res) => {
    res.json(carrito);
});

// Ruta para eliminar un producto del carrito
router.delete('/carrito/:id', (req, res) => {
    const { id } = req.params;
    carrito = carrito.filter(producto => producto.id != id); // Eliminar el producto
    res.json({ mensaje: 'Producto eliminado del carrito', carrito });
});

module.exports = router;
