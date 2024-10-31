// /models/Producto.js

const { DataTypes } = require('sequelize');
const sequelize = require('./index'); // Importa la conexión de Sequelize desde index.js

const Producto = sequelize.define('Producto', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'productos', // Nombre de la tabla en la base de datos
    timestamps: false // Si no deseas las columnas createdAt y updatedAt
});

module.exports = Producto;
