import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WizardsService } from '../../../../../pages/wizards/wizards.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { AgentlessWindowsWizardGet, AgentlessWindowsWizardPost } from './agentless-windows-wizard.interface';

@Injectable({
    providedIn: 'root'
})
export class AgentlessWindowsWizardService extends WizardsService {

    public fetch(hostId: number): Observable<AgentlessWindowsWizardGet> {
        return this.http.get<AgentlessWindowsWizardGet>(`${this.proxyPath}/ms_windows_agentless_module/wizards/agentlessWindows/${hostId}.json?angular=true&typeId=vmware-esx`).pipe(
            map((data: AgentlessWindowsWizardGet): AgentlessWindowsWizardGet => {
                return data;
            })
        );
    }

    public submit(post: AgentlessWindowsWizardPost): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/ms_windows_agentless_module/wizards/agentlessWindows.json?angular=true`, post)
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
