import { initializeDataBase } from "./db/index.js";
import { consumeCursoValidation } from "./rabbit/consume/consume_curso_validation.js";
import { app } from './server.js'

const port = 3001

app.listen(port, async () => {
    await initializeDataBase()
    console.log(`Servicio de curso se esta escuchando en: http://localhost:${port}`)
    consumeCursoValidation()
})