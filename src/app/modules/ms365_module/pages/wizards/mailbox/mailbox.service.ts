import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WizardsService } from '../../../../../pages/wizards/wizards.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { Ms365MailboxWizardGet, Ms365MailboxWizardPost } from './mailbox.interface';

@Injectable({
    providedIn: 'root'
})
export class M365MailboxService extends WizardsService {
    public fetch(hostId: number): Observable<Ms365MailboxWizardGet> {
        return this.http.get<Ms365MailboxWizardGet>(`${this.proxyPath}/ms365_module/wizards/mailbox/${hostId}.json?angular=true`).pipe(
            map((data: Ms365MailboxWizardGet): Ms365MailboxWizardGet => {
                return data;
            })
        );
    }

    public submit(post: Ms365MailboxWizardPost): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/ms365_module/wizards/mailbox.json?angular=true`, post)
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
