import axios from "axios";
import { enviroment } from "../../../../enviroments/enviroment"

export class unCreaticourse{
    static baseUrl = enviroment.baseUrl

    public static post(path: string, obj: any): Promise<any>{
        return axios.post(this.baseUrl + path, obj);
        
    }
}