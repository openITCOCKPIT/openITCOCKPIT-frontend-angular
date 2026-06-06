import { HttpContextToken, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

export const SKIP_ERROR_REDIRECT = new HttpContextToken<boolean>(() => false);

export function handleError(error: HttpErrorResponse): Observable<never> {
    let userFriendlyMessage = 'Something went wrong. Please try again.';
    if (error.status === 0) {
        // Network error (no internet, server unreachable)
        userFriendlyMessage = 'No internet connection. Please check your network.';
    } else if (error.status === 404) {
        userFriendlyMessage = 'The requested data was not found.';
    } else if (error.status === 401) {
        userFriendlyMessage = 'You are not authorized. Please log in.';
    } else if (error.status === 403) {
        userFriendlyMessage = 'Access denied. You do not have permission.';
    } else if (error.status === 500) {
        userFriendlyMessage = 'Server error. Please try again later.';
    }

// Log technical details for developers
    console.error(`HTTP Error ${error.status}:`, error.message);

// Re-throw with user-friendly message
    return throwError(() => new Error(userFriendlyMessage));
}
