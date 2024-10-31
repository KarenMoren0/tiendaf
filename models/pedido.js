// /models/Pedido.js

module.exports = (sequelize, DataTypes) => {
    const Pedido = sequelize.define('Pedido', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        usuarioId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'usuarios', // Nombre de la tabla a la que referencia
                key: 'id',
            },
        },
        fecha: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        estado: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'pendiente', // Opciones: pendiente, enviado, completado, cancelado
        },
    }, {
        tableName: 'pedidos',
        timestamps: false, // O puedes usar timestamps si quieres registrar createdAt y updatedAt
    });

    return Pedido;
};
