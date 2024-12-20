import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WizardsService } from '../../../../../pages/wizards/wizards.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { VmwarehorizonWizardGet, VmwarehorizonWizardPost } from './vmwarehorizon-wizard.interface';

@Injectable({
    providedIn: 'root'
})
export class VmwarehorizonWizardService extends WizardsService {

    public fetch(hostId: number): Observable<VmwarehorizonWizardGet> {
        return this.http.get<VmwarehorizonWizardGet>(`${this.proxyPath}/vmwarehorizon_module/wizards/vmwarehorizon/${hostId}.json?angular=true`).pipe(
            map((data: VmwarehorizonWizardGet): VmwarehorizonWizardGet => {
                return data;
            })
        );
    }

    public submit(post: VmwarehorizonWizardPost): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/vmwarehorizon_module/wizards/vmwarehorizon.json?angular=true`, post)
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