import { initializeDataBase } from "./db/index.js";
import  InitializeConsumers  from "./rabbit/init-consumers.js"
import 'dotenv/config'
import { app } from './server.js'

const port = 3001

app.listen(port, async () => {
    await initializeDataBase()
    await InitializeConsumers()
    console.log(process.env?.RABBIT_URL, " ", process.env?.EXCHANGE_CURSO_VALIDATION)
    console.log(process.env.EXCHANGE_CURSO_VALIDATION)
    console.log(process.env?.MS_CURSO_URL)
    console.log(`Servicio de curso se esta escuchando en: http://localhost:${port}`)
})