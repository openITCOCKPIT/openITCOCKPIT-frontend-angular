import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WizardsService } from '../../../../../pages/wizards/wizards.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import {
    ApacheTomcatMemoryPoolDiscoveryPost,
    ApacheTomcatMemoryPoolDiscoveryResponse,
    ApacheTomcatWizardGet,
    ApacheTomcatWizardPost,
} from './apache-tomcat-wizard.interface';

@Injectable({
    providedIn: 'root'
})
export class ApacheTomcatWizardService extends WizardsService {

    public fetch(hostId: number): Observable<ApacheTomcatWizardGet> {
        return this.http.get<ApacheTomcatWizardGet>(`${this.proxyPath}/apache_module/wizards/apache_tomcat/${hostId}.json?angular=true`).pipe(
            map((data: ApacheTomcatWizardGet): ApacheTomcatWizardGet => {
                return data;
            })
        );
    }

    public submit(post: ApacheTomcatWizardPost): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/apache_module/wizards/apache_tomcat.json?angular=true`, post)
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

    public executeMemoryPoolDiscovery(post: ApacheTomcatMemoryPoolDiscoveryPost): Observable<ApacheTomcatMemoryPoolDiscoveryResponse | GenericResponseWrapper> {
        return this.http.post<ApacheTomcatMemoryPoolDiscoveryResponse>(`${this.proxyPath}/apache_module/wizards/discovery/${post.host_id}.json?angular=true`, post)
            .pipe(
                map((data: ApacheTomcatMemoryPoolDiscoveryResponse) => {
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
