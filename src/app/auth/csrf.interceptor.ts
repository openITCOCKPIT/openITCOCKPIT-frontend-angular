import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from "@angular/core";
import { AuthService } from "./auth.service";
import { tap } from "rxjs";

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);

    let csrfRequest = req;
    const csrfToken = authService.csrfToken || '';

    if (req.method !== 'GET' && csrfToken !== '') {
        csrfRequest = req.clone({
            headers: req.headers.set('X-CSRF-Token', csrfToken)
        });
    }

    return next(csrfRequest).pipe(
        tap((event: any) => {
            if (event?.body?._csrfToken) {
                authService.csrfToken = event.body._csrfToken;
            }
        }),
    );
};
