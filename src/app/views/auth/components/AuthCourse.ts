import { ApiResponse } from "../../../interfaces/AppResponse";
import { unCreaticourse } from "./UnCreaticourse";

interface RegisterData {
    email: string;
    name: string;
    lastName: string;
    password1: string;
    password2: string;
}
  
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
        return (await unCreaticourse.post('/usuario', { query })).data
    }

    public static async register(data: RegisterData): Promise<ApiResponse> {

        console.log(`registro que llega: user = ${data.email}, pass = ${data.password1}, nombre = ${data.name}, ap = ${data.lastName}`);
        
        if (data.password1 !== data.password2) {
            throw new Error("Las contraseñas no coinciden");
        }

        const query = `
          mutation {
            createCliente(datosCliente: {
              email: "${data.email}",
              nombre: "${data.name}",
              apellido: "${data.lastName}",
              clave: "${data.password1}"
            })
          }
        `;
    
        console.log('Enviando datos al backend:', query);
    
        const response = await unCreaticourse.post('/usuario', { query });
        return response.data;
    }   
}