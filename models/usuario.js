// models/Usuario.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Usuario = sequelize.define('Usuario', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        contraseña: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    return Usuario;
};
