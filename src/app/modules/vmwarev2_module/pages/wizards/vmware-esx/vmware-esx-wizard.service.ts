import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WizardsService } from '../../../../../pages/wizards/wizards.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { VmwareEsxWizardGet, VmwareEsxWizardPost } from './vmware-esx-wizard.interface';

@Injectable({
    providedIn: 'root'
})
export class VmwareEsxWizardService extends WizardsService {

    public fetch(hostId: number): Observable<VmwareEsxWizardGet> {
        return this.http.get<VmwareEsxWizardGet>(`${this.proxyPath}/vmwarev2_module/wizards/vmware/${hostId}.json?angular=true&typeId=vmware-esx`).pipe(
            map((data: VmwareEsxWizardGet): VmwareEsxWizardGet => {
                return data;
            })
        );
    }

    public submit(post: VmwareEsxWizardPost): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/vmwarev2_module/wizards/vmware.json?angular=true`, post)
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
