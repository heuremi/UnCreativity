import axios from "axios";
import * as fs from 'fs';
import { randomInt } from "crypto";
import 'dotenv/config'

function readJSONFile() {
    try {
        const data = fs.readFileSync('../data.json',
            {encoding: "utf8"})
        const jsonObject = JSON.parse(data);
        return jsonObject
    } catch (err) {
        console.error("Error:", err);
    }
}

const data = readJSONFile();
data.forEach(element => {
    element.calificacion = randomInt(0, 5) + Math.random();
});
axios({
    url: process.env?.MS_CURSO_URL ||'http://localhost:3001/graphql',
    method: 'post',
    data: {
        query: `mutation createCursos($inputCursos: [CursoInput!]!) {
            createCursos(inputCursos: $inputCursos) {
                id
                titulo
                categorias
            }
        }`,
        variables: {
            inputCursos: data
        }
    }
}).then((res) => {
    console.log(res.status)
}).catch((err) => {
    console.log(err.message)
});