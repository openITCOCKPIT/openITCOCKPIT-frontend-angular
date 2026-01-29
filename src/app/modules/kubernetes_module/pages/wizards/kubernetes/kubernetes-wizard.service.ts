import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WizardsService } from '../../../../../pages/wizards/wizards.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import {
    EndpointDiscovery,
    KubernetesEndpointsWizardPost,
    KubernetesEndpointWizardGet
} from './kubernetes-wizard.interface';

@Injectable({
    providedIn: 'root'
})
export class KubernetesWizardService extends WizardsService {

    public fetch(hostId: number): Observable<KubernetesEndpointWizardGet> {
        return this.http.get<KubernetesEndpointWizardGet>(`${this.proxyPath}/kubernetes_module/wizards/kubernetes/${hostId}.json?angular=true`).pipe(
            map((data: KubernetesEndpointWizardGet): KubernetesEndpointWizardGet => {
                return data;
            })
        );
    }

    public submit(post: KubernetesEndpointsWizardPost): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/kubernetes_module/wizards/kubernetes.json?angular=true`, post)
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

    public executeEndpointDiscovery(post: KubernetesEndpointsWizardPost): Observable<EndpointDiscovery | GenericResponseWrapper> {
        return this.http.post<EndpointDiscovery>(`${this.proxyPath}/kubernetes_module/wizards/executeEndpointsDiscovery/${post.host_id}.json?angular=true`, post)
            .pipe(
                map((data: EndpointDiscovery) => {
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
