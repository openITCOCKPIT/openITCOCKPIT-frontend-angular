import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WizardsService } from '../../../../../pages/wizards/wizards.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { GudeSensorsSnmpDiscovery, GudeSensorsWizardGet, GudeSensorsWizardPost } from './gude-sensors-wizard.interface';

@Injectable({
    providedIn: 'root'
})
export class GudeSensorsWizardService extends WizardsService {

    public fetch(hostId: number): Observable<GudeSensorsWizardGet> {
        return this.http.get<GudeSensorsWizardGet>(`${this.proxyPath}/gude_module/wizards/gudeSensors/${hostId}.json?angular=true`).pipe(
            map((data: GudeSensorsWizardGet): GudeSensorsWizardGet => {
                return data;
            })
        );
    }

    public submit(post: GudeSensorsWizardPost): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/gude_module/wizards/gudeSensors.json?angular=true`, post)
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

    public executeGudeSensorsDiscovery(post: GudeSensorsWizardPost): Observable<GudeSensorsSnmpDiscovery | GenericResponseWrapper> {
        return this.http.post<GudeSensorsSnmpDiscovery>(`${this.proxyPath}/gude_module/wizards/executeGudeSensorsDiscovery/${post.host_id}.json?angular=true`, post)
            .pipe(
                map((data: GudeSensorsSnmpDiscovery) => {
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
