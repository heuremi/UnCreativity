import { ApiResponse } from "../../../interfaces/AppResponse";
import { User } from "../../../interfaces/User";
import { unCreaticourse } from "./UnCreaticourse";


export class AuthCourse{
    public static async login(email: String, password: String): Promise<ApiResponse>{
        const query = `
        mutation {
            login(
                email: "${email}"
                clave: "${password}"
            
            )
        }
        `;
        console.log(`login enviado: user = ${email}, pass = ${password}`);
        return (await unCreaticourse.post('/usuario', { query })).data
    }
}