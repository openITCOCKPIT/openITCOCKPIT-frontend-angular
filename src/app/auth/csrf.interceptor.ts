import {HttpEvent, HttpInterceptorFn, HttpResponse, HttpStatusCode} from '@angular/common/http';
import {inject} from "@angular/core";
import {AuthService} from "./auth.service";
import {catchError, EMPTY, tap} from "rxjs";

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const csrfRequest = req.clone({
    headers: req.headers.set('X-CSRF-Token', authService.csrfToken || '')
  });

  return next(csrfRequest).pipe(
    tap((event: any) => {
      if (event?.body?._csrfToken) {
        authService.csrfToken = event.body._csrfToken;
      }
    }),
  );
};
