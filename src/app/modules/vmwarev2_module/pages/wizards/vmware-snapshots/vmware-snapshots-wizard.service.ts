import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WizardsService } from '../../../../../pages/wizards/wizards.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { VmwareSnapshotsWizardGet, VmwareSnapshotsWizardPost } from './vmware-snapshots-wizard.interface';

@Injectable({
    providedIn: 'root'
})
export class VmwareSnapshotsWizardService extends WizardsService {

    public fetch(hostId: number): Observable<VmwareSnapshotsWizardGet> {
        return this.http.get<VmwareSnapshotsWizardGet>(`${this.proxyPath}/vmwarev2_module/wizards/vmware/${hostId}.json?angular=true&typeId=vmware-snapshots`).pipe(
            map((data: VmwareSnapshotsWizardGet): VmwareSnapshotsWizardGet => {
                return data;
            })
        );
    }

    public submit(post: VmwareSnapshotsWizardPost): Observable<GenericResponseWrapper> {
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
