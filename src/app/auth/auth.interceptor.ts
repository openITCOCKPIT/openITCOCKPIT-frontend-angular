import { HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { catchError, EMPTY, throwError } from "rxjs";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { LocalStorageService } from '../services/local-storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const router: Router = inject(Router);
    const authService: AuthService = inject(AuthService);
    const localStorageService: LocalStorageService = inject(LocalStorageService);

    return next(req).pipe(
        catchError((error) => {
            if (error.status === HttpStatusCode.Unauthorized) {
                authService.setUnauthorized();

                // Store the requested URL to redirect after login.
                let redirectUrl: string = window.location.href || '';
                if (redirectUrl.length && !redirectUrl.includes('login')) {
                    localStorageService.setItem('redirectUrl', redirectUrl);
                }

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
