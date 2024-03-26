import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "./auth.service";
import {tap, catchError, map, of, switchMap} from "rxjs";

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.authenticated$.pipe(
    switchMap(isLoggedIn => {
      if (isLoggedIn) {
        return of(isLoggedIn);
      } else {
        return of(router.createUrlTree(['/login']));
        }
    }),
  );
};
