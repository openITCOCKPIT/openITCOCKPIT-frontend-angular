import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WizardsService } from '../../../../../pages/wizards/wizards.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { Ms365OneDriveWizardGet, Ms365OneDriveWizardPost } from './one-drive.interface';

@Injectable({
    providedIn: 'root'
})
export class OneDriveService extends WizardsService {
    public fetch(hostId: number): Observable<Ms365OneDriveWizardGet> {
        return this.http.get<Ms365OneDriveWizardGet>(`${this.proxyPath}/ms365_module/wizards/onedrive/${hostId}.json?angular=true`).pipe(
            map((data: Ms365OneDriveWizardGet): Ms365OneDriveWizardGet => {
                return data;
            })
        );
    }

    public submit(post: Ms365OneDriveWizardPost): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/ms365_module/wizards/onedrive.json?angular=true`, post)
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
