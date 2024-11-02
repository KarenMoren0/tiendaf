const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('tienda', 'usuario', 'contraseña', {
    host: 'localhost',
    dialect: 'mysql', 
});

module.exports = sequelize;
