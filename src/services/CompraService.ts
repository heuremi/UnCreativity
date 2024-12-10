import axios from "axios";
import { enviroment } from "../enviroments/enviroment";


export interface ApiCompraErrorResponse {
    Code: number, 
    Message?: string
}

export interface ApiCompraResponse<T = any> {
    Code: number,
    Status: string,
    Data: T,
}


export interface CommitResponse {
    vci: string,
    amount: number,
    status: string,
    buy_order: string,
    session_id: string,
    cart_detail: {
        cart_number: string
    }
    accounting_date: string,
    transacion_date: string,
    authorization_code: string,
    payment_type_code: string,
    response_code: number,
    installments_number: number,
}

export interface CreateResponse {
    success: boolean,
    returnUrl: string,
    urlWebpay: string,
    token: string,
}

export interface GetComprasResponse {
    compras: {
        cursoId: number
    }[]
}

export interface GetComprasWithDateResponse {
    compras: Compra[]
} 

export type Compra  = {
    cursoId : number,
    fecha: string
}

export class CompraService {

    static compraUrl = enviroment.compraUrl
    static baseUrl = enviroment.baseUrl

    public static async GetStatusToken(token : string): Promise<ApiCompraErrorResponse | ApiCompraResponse<CommitResponse>> {
        try {
            const { data } = await axios.get(
                `${this.compraUrl}/status?token=${token}`,
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

    public static async CreateCompra(usuarioId: number, amount: number): Promise<ApiCompraErrorResponse | ApiCompraResponse<CreateResponse>> {
        try {
            const { data } = await axios.post(`${this.compraUrl}/create`,
                {
                    cliente_id: usuarioId,
                    amount: amount,
                }
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

    public static async GetCompras(usuarioId : number ): Promise<ApiCompraErrorResponse | ApiCompraResponse<number[]>> {
        const query = `
            {
                compras(filtro: {
                    clienteId: ${usuarioId}
                }) {
                    cursoId
                    fecha
                }
            }
        `;

        try {
            const { data } = await axios.post(
                `${this.baseUrl}/compra`,
                {
                    query
                }
            )
            const resp = data.data as GetComprasResponse
            const comprasNumeros = resp.compras.map((compra) => compra.cursoId);
            console.log(comprasNumeros)
            return {
                Code: 200,
                Status: "OK",
                Data: comprasNumeros
            }
        } catch (error: any) {
            console.log(error)
            return {
                Code: error?.response?.data?.code,
                Message: error?.response?.data?.message,
            }
        }
    }

    public static async GetComprasWithDate(usuarioId : number ): Promise<ApiCompraErrorResponse | ApiCompraResponse<Compra[]>> {
        const query = `
            {
                compras(filtro: {
                    clienteId: ${usuarioId}
                }) {
                    cursoId
                    fecha
                }
            }
        `;

        try {
            const { data } = await axios.post(
                `${this.baseUrl}/compra`,
                {
                    query
                }
            )
            const resp = data.data as GetComprasWithDateResponse
            return {
                Code: 200,
                Status: "OK",
                Data: resp.compras
            }
        } catch (error: any) {
            console.log(error)
            return {
                Code: error?.response?.data?.code,
                Message: error?.response?.data?.message,
            }
        }
    }
}