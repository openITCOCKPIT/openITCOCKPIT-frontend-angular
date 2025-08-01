import { inject, Injectable, DOCUMENT } from '@angular/core';
import { ActiveToast, ToastrService } from 'ngx-toastr';
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
    private readonly document = inject(DOCUMENT);

    constructor(private toastr: ToastrService, private TranslocoService: TranslocoService) {
    }

    genericSuccess(message?: string, title?: string, url?: any[], timeout?: number) {
        if (!message) {
            message = this.TranslocoService.translate('Data saved successfully');
        }

        if (!title) {
            title = this.TranslocoService.translate('Success');
        }

        const toast = this.toastr.success(message, title, {
            timeOut: (timeout) ? timeout : 5000,
            progressBar: true,
            enableHtml: true
        });

        if (url && url.length > 0) {
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


        if (!title) {
            title = this.TranslocoService.translate('Error');
        }

        const toast = this.toastr.error(message, title, {
            timeOut: 5000,
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

        if (!title) {
            title = this.TranslocoService.translate('Warning');
        }

        const toast = this.toastr.warning(message, title, {
            timeOut: 5000,
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

        if (!title) {
            title = this.TranslocoService.translate('Info');
        }

        const toast = this.toastr.info(message, title, {
            timeOut: 5000,
            progressBar: true,
            enableHtml: true,
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

    scrollContentDivToTop() {
        // The setTimeout fix the issue with the scrollIntoView not working properly ¯\_(ツ)_/¯
        setTimeout(() => {
            const element = this.document.getElementById("mainContentContainer");
            if (element) {
                element.scrollIntoView({behavior: 'smooth', block: 'start'});
            }
        }, 15);
    }

    scrollTop() {
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    noty(message: string, type: string, options: any, title?: string, url?: any[]) {

        let toast!: ActiveToast<any>;
        if (!title) {
            title = '';
        }

        switch (type) {
            case 'success':
                toast = this.toastr.success(message, title, options);
                break;
            case 'error':
                toast = this.toastr.error(message, title, options);
                break;
            case 'info':
                toast = this.toastr.info(message, title, options);
                break;
            case 'warning':
                toast = this.toastr.warning(message, title, options);
                break;
            default:
                toast = this.toastr.show(message, title, options);
        }

        if (url) {
            toast
                .onTap
                .pipe(take(1)) // auto unsubscribe
                .subscribe(() => {
                    this.router.navigate(url);
                });
        }
    }

    //scrollToTop() {
    // window.scrollTo({top: 0, behavior: 'smooth'});
    //    this.locationStrategy.onPopState(() => {
    //        window.scrollTo(0, 0);
    //    });
    //}
}
