import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WizardsService } from '../../../../../pages/wizards/wizards.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import {
    ProxmoxStoragesWizardPost,
    ProxmoxStorageWizardGet,
    ProxmoxStorageWizardPost,
    StorageDiscovery
} from './proxmox-storage-wizard.interface';

@Injectable({
    providedIn: 'root'
})
export class ProxmoxStorageWizardService extends WizardsService {

    public fetch(hostId: number): Observable<ProxmoxStorageWizardGet> {
        return this.http.get<ProxmoxStorageWizardGet>(`${this.proxyPath}/proxmox_module/wizards/storage/${hostId}.json?angular=true`).pipe(
            map((data: ProxmoxStorageWizardGet): ProxmoxStorageWizardGet => {
                return data;
            })
        );
    }

    public submit(post: ProxmoxStorageWizardPost): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/proxmox_module/wizards/storage.json?angular=true`, post)
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

    public executeStorageDiscovery(post: ProxmoxStoragesWizardPost): Observable<StorageDiscovery | GenericResponseWrapper> {
        return this.http.post<StorageDiscovery>(`${this.proxyPath}/proxmox_module/wizards/executeStorageDiscovery/${post.host_id}.json?angular=true`, post)
            .pipe(
                map((data: StorageDiscovery) => {
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
