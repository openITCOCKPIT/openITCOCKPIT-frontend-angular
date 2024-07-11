import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { GlobalLoadingService } from '../global-loading.service';
import { finalize } from 'rxjs';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
    const loading = inject(GlobalLoadingService);

    // Implement option to disable the GlobalAjaxLoader if the request contains "disableGlobalLoader"
    if (req.method === 'GET') {
        if (req.params.has('disableGlobalLoader')) {
            return next(req);
        }
    }

    loading.showLoader();
    return next(req).pipe(
        finalize(() => loading.hideLoader())
    );
};
