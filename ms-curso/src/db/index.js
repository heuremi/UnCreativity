import { connection } from './config/index.js'
import { Curso } from './models/index.js'

export const initializeDataBase = async () => {
    try {
        await connection.authenticate()
        await Curso.sync({ alter: true})

        console.log('Los modelos ORM se establecieron y se sincronizado correctamente')
    } catch (error) {
        console.error('No se pudo conectar con la base de datos Curso: ', error)
    }
}