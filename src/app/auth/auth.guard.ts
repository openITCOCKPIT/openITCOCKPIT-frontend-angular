import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "./auth.service";
import {tap, catchError, map, of} from "rxjs";

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.checkAuthentication().pipe(
    tap(console.info),
    map(() => true),
    catchError((err) => {
      console.error('oh snap', err);

      return of(router.createUrlTree(['/login']));
    })
  );
};
