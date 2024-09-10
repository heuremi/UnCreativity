import { ApiResponse } from "../../../interfaces/AppResponse";
import { User } from "../../../interfaces/User";
import { unCreaticourse } from "./UnCreaticourse";


export class AuthCourse{
    public static async login(obj: User): Promise<ApiResponse>{
        return (await unCreaticourse.post('/login', obj)).data
    }
}