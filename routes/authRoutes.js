// /routes/authRoutes.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models/Usuario'); // Asegúrate de que la ruta sea correcta

const router = express.Router();
const SECRET_KEY = 'your_secret_key'; // Cambia esto por una clave segura y almacénala en un archivo de configuración

// Ruta de registro de usuario
router.post('/register', [
    body('nombre').notEmpty().trim().escape(), // Validar el nombre
    body('email').isEmail().normalizeEmail(), // Validar el email
    body('contraseña').isLength({ min: 5 }).trim().escape() // Validar la contraseña
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
    }

    const { nombre, email, contraseña } = req.body;

    try {
        // Hashear la contraseña antes de guardar el usuario
        const hashedPassword = await bcrypt.hash(contraseña, 10);
        
        // Crear nuevo usuario en la base de datos
        const nuevoUsuario = await Usuario.create({ nombre, email, contraseña: hashedPassword });
        res.status(201).json({ mensaje: 'Usuario registrado exitosamente', id: nuevoUsuario.id });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar usuario', detalles: error.message });
    }
});

// Ruta de inicio de sesión
router.post('/login', [
    body('email').isEmail().normalizeEmail(),
    body('contraseña').notEmpty().trim()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
    }

    const { email, contraseña } = req.body;

    try {
        // Buscar el usuario en la base de datos
        const usuario = await Usuario.findOne({ where: { email } });
        
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Verificar la contraseña
        const isPasswordValid = await bcrypt.compare(contraseña, usuario.contraseña);
        
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Generar token JWT
        const token = jwt.sign({ userId: usuario.id }, SECRET_KEY, { expiresIn: '1h' });
        
        res.json({ mensaje: 'Inicio de sesión exitoso', token });
    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesión', detalles: error.message });
    }
});

module.exports = router;
