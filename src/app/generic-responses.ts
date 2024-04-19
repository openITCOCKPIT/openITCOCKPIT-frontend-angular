export interface GenericValidationError {
    [key: string]: {
        [key: string]: string
    }
}

export interface GenericSuccessResponse {
    success: boolean;
}
