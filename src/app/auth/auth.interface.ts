export interface LoginResponse {
    success: boolean
    errors: {
        [key: string]: string[]
    }
}
