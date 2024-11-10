export interface ApiResponse<T = any>{
    date: any[],
    success: boolean,
    status: number,
    statusText: string,
    data: T
}

