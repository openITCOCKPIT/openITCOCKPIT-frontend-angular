import {HttpInterceptorFn, HttpStatusCode} from '@angular/common/http';
import {catchError, EMPTY} from "rxjs";
import {inject} from "@angular/core";
import {Router} from "@angular/router";
import {AuthService} from "./auth.service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === HttpStatusCode.Unauthorized) {
        authService.setUnauthorized();
        router.navigate(['/users/login']);
      }

      return EMPTY;
    })
  );
};
