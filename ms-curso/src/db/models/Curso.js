import { connection } from '../config/index.js'

import { DataTypes } from 'sequelize'

const Curso = connection.define('curso', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: true
    },
    autor: {
        type: DataTypes.STRING,
        allowNull: true
    },
    imagenUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    rate: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    categoria: {
        type: DataTypes.STRING,
        allowNull: false
    },
    estaDelete: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    }
},{
    tableName: 'cursos',
    timestamps: false,
    createdAt: false,
    updatedAt: false
})

export { Curso } 