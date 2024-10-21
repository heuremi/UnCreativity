
import { consumeCursoValidation } from "./consume/consume_curso_validation.js";



export default async function InitializeConsumers() {

    try {
        consumeCursoValidation()
    } catch(error) {
        console.log("Error")
    }
} 