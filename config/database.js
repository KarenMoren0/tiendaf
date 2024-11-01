const { Sequelize } = require('sequelize');

// Cambia los valores por tus credenciales de la base de datos
const sequelize = new Sequelize('tienda', 'usuario', 'contraseña', {
    host: 'localhost',
    dialect: 'mysql', // o 'mariadb'
});

module.exports = sequelize;
