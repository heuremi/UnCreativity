import { initializeDataBase } from "./db/index.js";
import  InitializeConsumers  from "./rabbit/init-consumers.js"
import { app } from './server.js'

const port = 3001

app.listen(port, async () => {
    await initializeDataBase()
    console.log(`Servicio de curso se esta escuchando en: http://localhost:${port}`)
    //InitializeConsumers()
})