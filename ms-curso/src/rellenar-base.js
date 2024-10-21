import axios from "axios";
import { Variable } from "lucide-react";
import * as fs from 'fs';
import { options } from "babel";


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

axios({
    url: 'http://localhost:3001/graphql',
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
    console.log(res)
}).catch((err) => {

});