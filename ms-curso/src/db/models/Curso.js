import { connection } from '../config/index.js'

import { DataTypes } from 'sequelize'

const Curso = connection.define('curso', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subtitulo: {
        type: DataTypes.STRING,
        allowNull: true

    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    autor: {
        type: DataTypes.STRING,
        allowNull: true
    },
    idioma: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imagenUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    calificacion: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    categorias: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: []
    },
    fechaCreacion: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    precio: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    estaDelete: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    }
},{
    tableName: 'cursos',
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    underscored: true
})

export { Curso } 