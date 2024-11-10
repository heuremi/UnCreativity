import { connection } from './config/index.js'
import { Cliente } from './models/index.js'
import { Compra } from './models/index.js';

export const initializeDataBase = async () => {
    try {
        await connection.authenticate();
        await Cliente.sync({ force: true});
        await Compra.sync({ force: true});

        console.log('Los modelos ORM se establecieron y se sincronizaron correctamente');
    } catch (error) {
        console.error('No se pudo conectar con la base de datos de Usuario: ', error);
    }
};