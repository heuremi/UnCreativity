import axios from "axios";
import { enviroment } from "../enviroments/enviroment";


export interface ApiCartErrorResponse {
    Code: number, 
    Message?: string
}

export interface ApiCartResponse<T = any | undefined> {
    Code: number,
    Status: string,
    Data: T,
}




  
export class CartService {

    static cartUrl = enviroment.carritoBaseUrl

    public static async CreateCart(idCliente : number): Promise<ApiCartErrorResponse | ApiCartResponse> {
        try {
            const { data } = await axios.post(
                `${this.cartUrl}/cliente/${idCliente}/carrito`,
            )
            return {
                Code: data.code,
                Status: data.status,
                Data: data.data
            }
        } catch (error: any) {
            return {
                Code: error?.response?.data?.code,
                Message: error?.response?.data?.message,
            }
        }
    }

    public static async GetCourses(idCliente : number): Promise<ApiCartErrorResponse | ApiCartResponse<number[]>> {
        try {
            const { data } = await axios.get(
                `${this.cartUrl}/cliente/${idCliente}/carrito/curso`,
            )
            const objCursos = data.data
            const cursos = Object.keys(objCursos).map(function (key) { return objCursos[key]['curso_id']; });
            return {
                Code: data.code,
                Status: data.Status,
                Data: cursos
            }
        } catch (error: any) {
            return {
                Code: error?.response?.data?.code,
                Message: error?.response?.data?.message,
            }
        }
    }

    public static async GetAmountCoursesCart(idCliente : number): Promise<ApiCartErrorResponse | ApiCartResponse<number>> {
        try {
            const { data } = await axios.get(
                `${this.cartUrl}/cliente/${idCliente}/carrito/curso/all`,
            )
            return {
                Code: data.code,
                Status: data.Status,
                Data: data.data
            }
        } catch (error: any) {
            return {
                Code: error?.response?.data?.code,
                Message: error?.response?.data?.message,
            }
        }
    }

    public static async AddCourse(idCliente : number, idCurso : number): Promise<ApiCartErrorResponse | ApiCartResponse > {
        try {
            const { data } = await axios.post(
                `${this.cartUrl}/cliente/${idCliente}/carrito/curso/${idCurso}`,{},
                {
                    timeout: 5000,
                }
            )
            const ApiCartResponse = {
                Code: data.code,
                Status: data.status,
                Data: data.data
            }
            return ApiCartResponse;

        } catch (error: any) {
            console.log(error)
            const ErrorResponse = {
                Code: error.response.data.code,
                Message: error.response.data.message,
            }
            return ErrorResponse
        }
    }

    public static async DeleteCourse(idCliente : number, idCurso : number): Promise<ApiCartErrorResponse | ApiCartResponse> {
        try {
            const { data } = await axios.delete(
                `${this.cartUrl}/cliente/${idCliente}/carrito/curso/${idCurso}`,
            )
            return {
                Code: data.code,
                Status: data.status,
                Data: data.data
            }
        } catch (error: any) {
            return {
                Code: error?.response?.data?.code,
                Message: error?.response?.data?.message,
            }
        }
    }

    public static async DeleteAllCourse(idCliente: number) : Promise<ApiCartErrorResponse | ApiCartResponse> {
        try {
            const { data } = await axios.delete(
                `${this.cartUrl}/cliente/${idCliente}/carrito/curso/all`,
            )
            return {
                Code: data?.code,
                Status: data?.status,
                Data: data?.data
            }
        } catch (error: any) {
            return {
                Code: error?.response?.data?.code,
                Message: error?.response?.data?.message,
            }
        }
    }

}