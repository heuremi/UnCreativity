import { AxiosResponse } from "axios";
import { ApiResponse } from "../../../interfaces/AppResponse";
import { LoginResponse, RegisterResponse, unCreaticourse } from "./UnCreaticourse";

interface RegisterData {
    email: string;
    name: string;
    lastName: string;
    rut: string,
    phoneNumber: string,
    password1: string;
    password2: string;
}


  
export class AuthCourse{
    public static async login(email: String, password: String): Promise<ApiResponse<LoginResponse>> {
        console.log(`em: ${email}, pass: ${password}`)
        const query = `
            mutation {
                login(
                    email: "${email}"
                    clave: "${password}"
                ) {
                    id
                    success
                }
            }
        `;
    
        const res  = ((await unCreaticourse.post<LoginResponse>('/usuario', { query })))      
        return res;
    }

    public static async register(data: RegisterData): Promise<ApiResponse<RegisterResponse>> {

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
            }) {
                id
            }
          }
        `;
    
        console.log('Enviando datos al backend:', query);
    
        return (await unCreaticourse.post<RegisterResponse>('/usuario', { query }));

    }   
}