import { connection } from '../config/index.js'

import { DataTypes } from 'sequelize'

const Cliente = connection.define('cliente', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    apellido: {
        type: DataTypes.STRING,
        allowNull: true
    },
    rut: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: true
    },
    admin_S: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    clave: {
        type: DataTypes.STRING,
        allowNull: false
    },
    estaDelete: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    }
},{
    tableName: 'clientes',
    timestamps: false,
    createdAt: false,
    updatedAt: false
});

export { Cliente } 