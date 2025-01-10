import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WizardsService } from '../../../../../pages/wizards/wizards.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import {
    VmwareThroughVcenterWizardGet,
    VmwareThroughVcenterWizardPost
} from './vmware-through-vcenter-wizard.interface';

@Injectable({
    providedIn: 'root'
})
export class VmwareThroughVcenterWizardService extends WizardsService {

    public fetch(hostId: number): Observable<VmwareThroughVcenterWizardGet> {
        return this.http.get<VmwareThroughVcenterWizardGet>(`${this.proxyPath}/vmware_module/wizards/vmware/${hostId}.json?angular=true&typeId=vmware-through-vcenter`).pipe(
            map((data: VmwareThroughVcenterWizardGet): VmwareThroughVcenterWizardGet => {
                return data;
            })
        );
    }

    public submit(post: VmwareThroughVcenterWizardPost): Observable<GenericResponseWrapper> {
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