import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WizardsService } from '../../../../../pages/wizards/wizards.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { VmwareEsxDirectlyWizardGet, VmwareEsxDirectlyWizardPost } from './vmware-esx-directly-wizard.interface';

@Injectable({
    providedIn: 'root'
})
export class VmwareEsxDirectlyWizardService extends WizardsService {

    public fetch(hostId: number): Observable<VmwareEsxDirectlyWizardGet> {
        return this.http.get<VmwareEsxDirectlyWizardGet>(`${this.proxyPath}/vmware_module/wizards/vmware/${hostId}.json?angular=true&typeId=vmware-esx-directly`).pipe(
            map((data: VmwareEsxDirectlyWizardGet): VmwareEsxDirectlyWizardGet => {
                return data;
            })
        );
    }

    public submit(post: VmwareEsxDirectlyWizardPost): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/vmware_module/wizards/vmware.json?angular=true`, post)
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