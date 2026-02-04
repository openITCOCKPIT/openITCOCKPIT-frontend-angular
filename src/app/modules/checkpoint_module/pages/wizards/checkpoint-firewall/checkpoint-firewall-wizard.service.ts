import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WizardsService } from '../../../../../pages/wizards/wizards.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { CheckpointFirewallWizardPost } from './checkpoint-firewall-wizard.interface';
import { WizardGet } from '../../../../../pages/wizards/wizards.interface';

@Injectable({
    providedIn: 'root'
})
export class CheckpointFirewallWizardService extends WizardsService {

    public fetch(hostId: number): Observable<WizardGet> {
        return this.http.get<WizardGet>(`${this.proxyPath}/checkpoint_module/wizards/checkpointFirewall/${hostId}.json?angular=true`).pipe(
            map((data: WizardGet): WizardGet => {
                return data;
            })
        );
    }

    public submit(post: CheckpointFirewallWizardPost): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/checkpoint_module/wizards/checkpointFirewall.json?angular=true`, post)
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
