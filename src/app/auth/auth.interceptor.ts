import { HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { catchError, EMPTY, throwError } from "rxjs";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    return next(req).pipe(
        catchError((error) => {
            if (error.status === HttpStatusCode.Unauthorized) {
                authService.setUnauthorized();
                router.navigate(['/users/login']);

                return EMPTY;
            }

            if (error.status === HttpStatusCode.NotFound) {
                router.navigate(['/error/404']);
            }

            if (error.status === HttpStatusCode.Forbidden) {
                router.navigate(['/error/403']);
            }

            // re-throw all other errors so components can handle them
            return throwError(() => error);
        })
    );
};
