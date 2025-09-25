import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WizardsService } from '../../../../../pages/wizards/wizards.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import {
    ProxmoxStoragesWizardPost,
    ProxmoxWizardGet,
    ProxmoxWizardPost,
    StorageDiscovery
} from './proxmox-wizard.interface';

@Injectable({
    providedIn: 'root'
})
export class ProxmoxWizardService extends WizardsService {

    public fetch(hostId: number): Observable<ProxmoxWizardGet> {
        return this.http.get<ProxmoxWizardGet>(`${this.proxyPath}/proxmox_module/wizards/proxmox/${hostId}.json?angular=true`).pipe(
            map((data: ProxmoxWizardGet): ProxmoxWizardGet => {
                return data;
            })
        );
    }

    public submit(post: ProxmoxWizardPost): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/proxmox_module/wizards/proxmox.json?angular=true`, post)
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
