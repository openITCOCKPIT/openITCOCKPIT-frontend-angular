import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import {
    JiraSettingsGetResponse,
    JiraSettingsPost,
    LoadJiraProjectDetailsResponse,
    LoadJiraProjectParams,
    LoadJiraProjectsResponse
} from './jira-settings.interface';
import { GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';

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

    public loadProjectDetails(params: LoadJiraProjectParams, projectKey: string): Observable<LoadJiraProjectDetailsResponse> {
        const proxyPath = this.proxyPath;
        return this.http.post<LoadJiraProjectDetailsResponse>(`${proxyPath}/jira_module/JiraSettings/loadProjectDetails/${projectKey}.json`, params).pipe(
            map(data => {
                return data;
            })
        )
    }

    public updateJiraSettings(data: JiraSettingsPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;

        return this.http.post<any>(`${proxyPath}/jira_module/JiraSettings/index.json`, {
            JiraSettings: data
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data.settings as JiraSettingsPost
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
