import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WizardsService } from '../../../../../pages/wizards/wizards.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import {
    DatastoreDiscovery,
    VmwareDatastoresWizardGet,
    VmwareDatastoresWizardPost
} from './vmware-datastores-wizard.interface';

@Injectable({
    providedIn: 'root'
})
export class VmwareDatastoresWizardService extends WizardsService {

    public fetch(hostId: number): Observable<VmwareDatastoresWizardGet> {
        return this.http.get<VmwareDatastoresWizardGet>(`${this.proxyPath}/vmware_module/wizards/vmware/${hostId}.json?angular=true&typeId=vmware-datastores`).pipe(
            map((data: VmwareDatastoresWizardGet): VmwareDatastoresWizardGet => {
                return data;
            })
        );
    }

    public submit(post: VmwareDatastoresWizardPost): Observable<GenericResponseWrapper> {
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

    public executeDatastoreDiscovery(post: VmwareDatastoresWizardPost): Observable<DatastoreDiscovery | GenericResponseWrapper> {
        return this.http.post<DatastoreDiscovery>(`${this.proxyPath}/vmware_module/wizards/executeDatastoreDiscovery/${post.host_id}.json?angular=true`, post)
            .pipe(
                map((data: DatastoreDiscovery) => {
                    return data
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
