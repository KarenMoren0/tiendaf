const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const { Usuario } = require('./models'); // Asegúrate de que el modelo Usuario esté correctamente importado
const router = express.Router();

// Definir validaciones en la ruta de registro de usuarios
router.post('/', [
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

// Exportar el router
module.exports = router;
