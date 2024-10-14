import { connection } from '../config/index.js'
import { Cliente } from './Cliente.js'
import { DataTypes } from 'sequelize'

const Compra = connection.define('compra', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true
    },
    emailCliente: {
        field: "email_cliente",
        type: DataTypes.STRING,
        allowNull: false, 
    },
    cursoId: {
        field: "curso_id",
        type: DataTypes.INTEGER,
        allowNull: false,
        //Falta integrar el foreign key, ver mas adelante posibilidad de rabbit
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    }
},{
    indexes: [
        {
          fields: ['email_cliente', 'curso_id'],
          unique: true,
        }
    ],
    tableName: 'compras',
    timestamps: false,
    createdAt: false,
    updatedAt: false
});
 
Cliente.hasMany(Compra, {
    foreignKey: 'email_cliente',
    sourceKey: 'email'
});
export { Compra } 