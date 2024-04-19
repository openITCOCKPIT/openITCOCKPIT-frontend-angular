import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslocoService } from '@jsverse/transloco';


@Injectable({
    providedIn: 'root'
})
export class NotyService {

    constructor(private toastr: ToastrService, private TranslocoService: TranslocoService) {
    }

    genericSuccess(message?: string, title?: string) {
        if (!message) {
            message = this.TranslocoService.translate('Data saved successfully');
        }

        this.toastr.success(message, title, {
            timeOut: 3500,
            progressBar: true,
            enableHtml: true
        })
    }

    genericError(message?: string, title?: string) {
        if (!message) {
            message = this.TranslocoService.translate('Error while saving data');
        }

        this.toastr.error(message, title, {
            timeOut: 3500,
            progressBar: true,
            enableHtml: true
        })
    }

    genericWarning(message?: string, title?: string) {
        if (!message) {
            message = this.TranslocoService.translate('Warning - something unexpected happened');
        }

        this.toastr.warning(message, title, {
            timeOut: 3500,
            progressBar: true,
            enableHtml: true
        })
    }

    genericInfo(message?: string, title?: string) {
        if (!message) {
            message = this.TranslocoService.translate('Please wait while processing ...');
        }

        this.toastr.info(message, title, {
            timeOut: 3500,
            progressBar: true,
            enableHtml: true
        })
    }
}

