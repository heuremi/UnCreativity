
import { consumeCursoValidation } from "./consume/consume_curso_validation.js";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export default async function InitializeConsumers() {
    
    try {
        await consumeCursoValidation()
    } catch(error) {
        console.log(error.message)
    }

} 