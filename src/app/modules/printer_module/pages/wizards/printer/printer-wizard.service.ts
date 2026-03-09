import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WizardsService } from '../../../../../pages/wizards/wizards.service';
import { PrinterWizardPost } from './printer-wizard.interface';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { WizardGet } from '../../../../../pages/wizards/wizards.interface';

@Injectable({
    providedIn: 'root'
})
export class PrinterWizardService extends WizardsService {

    public fetch(hostId: number): Observable<WizardGet> {
        return this.http.get<WizardGet>(`${this.proxyPath}/printer_module/wizards/printer/${hostId}.json?angular=true`).pipe(
            map((data: WizardGet): WizardGet => {
                return data;
            })
        );
    }

    public submit(post: PrinterWizardPost): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/printer_module/wizards/printer.json?angular=true`, post)
            .pipe(
                map(data => {
                    return {
                        success: true,
                        data: null
                    };
                }),
                catchError((error: any) => {
                    const err = error.error.error as GenericValidationError;
                    return of({
                        success: false,
                        data: err
                    });
                })
            );

    }
}
