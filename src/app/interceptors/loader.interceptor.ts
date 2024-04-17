import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { GlobalLoadingService } from '../global-loading.service';
import { finalize } from 'rxjs';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loading = inject(GlobalLoadingService);

  loading.showLoader();
  return next(req).pipe(
    finalize(() => loading.hideLoader())
  );
};
