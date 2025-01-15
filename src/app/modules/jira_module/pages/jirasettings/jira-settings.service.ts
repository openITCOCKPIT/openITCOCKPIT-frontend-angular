import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import {
    JiraSettingsGetResponse,
    JiraSettingsPost,
    LoadJiraProjectParams,
    LoadJiraProjectsResponse
} from './jira-settings.interface';

@Injectable({
    providedIn: 'root'
})
export class JiraSettingsService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    constructor() {
    }

    public getJiraSettings(): Observable<JiraSettingsPost> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<JiraSettingsGetResponse>(`${proxyPath}/jira_module/JiraSettings/index.json`, {
            params: {}
        }).pipe(
            map((data: JiraSettingsGetResponse) => {
                return data.settings.JiraSettings;
            })
        );
    }

    public loadProjects(params: LoadJiraProjectParams): Observable<LoadJiraProjectsResponse> {
        const proxyPath = this.proxyPath;
        return this.http.post<LoadJiraProjectsResponse>(`${proxyPath}/jira_module/JiraSettings/loadProjects.json`, params).pipe(
            map(data => {
                return data;
            })
        )
    }

}
