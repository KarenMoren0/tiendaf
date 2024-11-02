// /config/config.js

module.exports = {
    development: {
        username: 'root',
        password: '', // Deja vacío si no tienes contraseña en MySQL
        database: 'tienda', // Nombre de tu base de datos
        host: '127.0.0.1',
        dialect: 'mysql',
    },
    test: {
        username: 'root',
        password: '',
        database: 'tienda_test',
        host: '127.0.0.1',
        dialect: 'mysql',
        logging: false,
    },
    production: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false,
    },
};
