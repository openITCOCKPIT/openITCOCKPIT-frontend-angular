import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { AiSettings, AiSettingsIndexResponse } from './ai-settings.interface';
import { GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';

@Injectable({
    providedIn: 'root'
})
export class AiSettingsService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public get(): Observable<AiSettingsIndexResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<AiSettingsIndexResponse>(`${proxyPath}/ai_module/settings/index.json`, {
            params: {angular: true}
        }).pipe(map(data => data));
    }

    /**
     * The providers offered as the model for the module's errands.
     *
     * Its own endpoint rather than the agent form's: editing the globals and
     * editing agents are separate grants, and borrowing that action would make
     * this page need one it has no business needing.
     */
    public loadProviders(): Observable<SelectKeyValue[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ providers: SelectKeyValue[] }>(`${proxyPath}/ai_module/settings/loadProviders.json`, {
            params: {angular: true}
        }).pipe(
            map(data => {
                return data.providers;
            })
        );
    }

    public save(settings: AiSettings): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/ai_module/settings/index.json?angular=true`, {
            AiSetting: settings
        }).pipe(
            map(data => ({success: true, data: data.AiSetting})),
            catchError((error: any) => of({success: false, data: error.error.error as GenericValidationError}))
        );
    }
}
