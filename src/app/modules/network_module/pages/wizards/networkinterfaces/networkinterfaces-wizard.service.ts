import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WizardsService } from '../../../../../pages/wizards/wizards.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import {
    NetworkinterfacesDiscovery,
    NetworkinterfacesWizardGet,
    NetworkinterfacesWizardPost,
} from './networkinterfaces-wizard.interface';

@Injectable({
    providedIn: 'root'
})
export class NetworkinterfacesWizardService extends WizardsService {

    public fetch(hostId: number): Observable<NetworkinterfacesWizardGet> {
        return this.http.get<NetworkinterfacesWizardGet>(`${this.proxyPath}/network_module/wizards/networkinterfaces/${hostId}.json?angular=true`).pipe(
            map((data: NetworkinterfacesWizardGet): NetworkinterfacesWizardGet => {
                return data;
            })
        );
    }

    public submit(post: NetworkinterfacesWizardPost): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/network_module/wizards/networkinterfaces.json?angular=true`, post)
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

    public executeNetworkinterfacesDiscovery(post: NetworkinterfacesWizardPost): Observable<NetworkinterfacesDiscovery | GenericResponseWrapper> {
        return this.http.post<NetworkinterfacesDiscovery>(`${this.proxyPath}/network_module/wizards/executeNetworkinterfacesDiscovery/${post.host_id}.json?angular=true`, post)
            .pipe(
                map((data: NetworkinterfacesDiscovery) => {
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
