import { initializeDataBase } from "./db/index.js";
import { app } from './server.js'

const port = 3002

app.listen(port, async () => {
    await initializeDataBase();
    console.log(`Servicio de usuario se esta escuchando en: http://localhost:${port}`);
})