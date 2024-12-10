import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WizardsService } from '../../../../../pages/wizards/wizards.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { HpServerHardwareWizardGet, HpServerHardwareWizardPost } from './hpserverhardware-wizard.interface';

@Injectable({
    providedIn: 'root'
})
export class HpServerHardwareWizardService extends WizardsService {

    public fetch(hostId: number): Observable<HpServerHardwareWizardGet> {
        return this.http.get<HpServerHardwareWizardGet>(`${this.proxyPath}/hpserverhardware_module/wizards/hpserverhardware/${hostId}.json?angular=true`).pipe(
            map((data: HpServerHardwareWizardGet): HpServerHardwareWizardGet => {
                return data;
            })
        );
    }

    public submit(post: HpServerHardwareWizardPost): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/hpserverhardware_module/wizards/hpserverhardware.json?angular=true`, post)
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