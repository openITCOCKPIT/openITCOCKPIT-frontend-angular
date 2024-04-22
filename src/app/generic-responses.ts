// This wrapper gets used to return a static data type.
// If success=true, the data got saved sucessfully and we mostlikely a GenericIdResponse to show the sucess message
// If success=false, than we have a validation error
export interface GenericResponseWrapper {
    success: boolean,
    data: GenericValidationError | GenericIdResponse | GenericSuccessResponse
}

export interface GenericValidationError {
    [key: string]: {
        [key: string]: string
    }
}

// Most delete actions return "success" true/false
export interface GenericSuccessResponse {
    success: boolean;
}

// Most add/edit actions return "id=123" on sucess so we can link to the new created or modified object
export interface GenericIdResponse {
    id: number;
}
