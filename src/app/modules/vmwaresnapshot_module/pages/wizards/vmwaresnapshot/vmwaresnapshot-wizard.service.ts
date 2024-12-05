import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WizardsService } from '../../../../../pages/wizards/wizards.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { VmwareSnapshotWizardGet, VmwareSnapshotWizardPost } from './vmwaresnapshot-wizard.interface';

@Injectable({
    providedIn: 'root'
})
export class VmwaresnapshotWizardService extends WizardsService {

    public fetch(hostId: number): Observable<VmwareSnapshotWizardGet> {
        return this.http.get<VmwareSnapshotWizardGet>(`${this.proxyPath}/vmwaresnapshot_module/wizards/vmwaresnapshot/${hostId}.json?angular=true`).pipe(
            map((data: VmwareSnapshotWizardGet): VmwareSnapshotWizardGet => {
                return data;
            })
        );
    }

    public submit(post: VmwareSnapshotWizardPost): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/vmwaresnapshot_module/wizards/vmwaresnapshot.json?angular=true`, post)
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