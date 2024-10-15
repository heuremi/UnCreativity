export interface ApiResponse{
    date: any[],
    success: boolean,
    status: number,
    message: string,
    data: {
        login: boolean;
    };
}