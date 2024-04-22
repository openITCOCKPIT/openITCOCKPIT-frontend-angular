import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslocoService } from '@jsverse/transloco';
import { LocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { take } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class NotyService {

    private locationStrategy = inject(LocationStrategy);
    private router = inject(Router);

    constructor(private toastr: ToastrService, private TranslocoService: TranslocoService) {
    }

    genericSuccess(message?: string, title?: string, url?: any[]) {
        if (!message) {
            message = this.TranslocoService.translate('Data saved successfully');
        }

        const toast = this.toastr.success(message, title, {
            timeOut: 3500,
            progressBar: true,
            enableHtml: true
        });

        if (url) {
            toast
                .onTap
                .pipe(take(1)) // auto unsubscribe
                .subscribe(() => {
                    this.router.navigate(url);
                });
        }

    }

    genericError(message?: string, title?: string, url?: any[]) {
        if (!message) {
            message = this.TranslocoService.translate('Error while saving data');
        }

        const toast = this.toastr.error(message, title, {
            timeOut: 3500,
            progressBar: true,
            enableHtml: true
        });

        if (url) {
            toast
                .onTap
                .pipe(take(1)) // auto unsubscribe
                .subscribe(() => {
                    this.router.navigate(url);
                });
        }
    }

    genericWarning(message?: string, title?: string, url?: any[]) {
        if (!message) {
            message = this.TranslocoService.translate('Warning - something unexpected happened');
        }

        const toast = this.toastr.warning(message, title, {
            timeOut: 3500,
            progressBar: true,
            enableHtml: true
        });

        if (url) {
            toast
                .onTap
                .pipe(take(1)) // auto unsubscribe
                .subscribe(() => {
                    this.router.navigate(url);
                });
        }
    }

    genericInfo(message?: string, title?: string, url?: any[]) {
        if (!message) {
            message = this.TranslocoService.translate('Please wait while processing ...');
        }

        const toast = this.toastr.info(message, title, {
            timeOut: 3500,
            progressBar: true,
            enableHtml: true
        });

        if (url) {
            toast
                .onTap
                .pipe(take(1)) // auto unsubscribe
                .subscribe(() => {
                    this.router.navigate(url);
                });
        }
    }
}
