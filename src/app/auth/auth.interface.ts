import { GenericValidationError } from '../generic-responses';

export interface LoginResponse {
    success: boolean
    errors?: {
        [key: string]: string[]
    } | GenericValidationError
}
