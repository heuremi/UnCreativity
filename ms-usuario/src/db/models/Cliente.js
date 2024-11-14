import { connection } from '../config/index.js'

import { DataTypes } from 'sequelize'

const Cliente = connection.define('cliente', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: true
    },
    apellido: {
        type: DataTypes.STRING,
        allowNull: true
    },
    rut: {
        type: DataTypes.STRING,
        allowNull: true
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: true
    },
    admin_S: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
    clave: {
        type: DataTypes.STRING,
        allowNull: true
    },
    estaDelete: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    }
},{
    tableName: 'clientes',
    timestamps: false,
    createdAt: false,
    updatedAt: false
});

export { Cliente } 