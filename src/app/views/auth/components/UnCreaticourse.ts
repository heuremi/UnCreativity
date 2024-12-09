import axios, { Axios, AxiosResponse } from "axios";
import { enviroment } from "../../../../enviroments/enviroment"
import { ApiResponse } from "../../../../interfaces/AppResponse";
import { string } from "yup";

export interface LoginResponse {
    login: {
        id: number,
        success: boolean
    }
}

export interface RegisterResponse {
    createCliente: {
        id: string
    }
    errors?: string[]
}


export class unCreaticourse{
    static baseUrl = enviroment.baseUrl

    public static async post<T>(path: string, obj: any): Promise<ApiResponse<T>>{
        const response : AxiosResponse<ApiResponse<T>> =  await axios.post(this.baseUrl + path, obj);
        console.log(response)
        console.log(response.status)
        return response.data
    }
}