import { DOCUMENT, inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { BackgroundsParams, BackgroundsRoot, MapUploadEdit, MapUploadItem } from './backgrounduploads.interface';
import { LoadContainersRoot } from '../../../../pages/contacts/contacts.interface';

@Injectable({
    providedIn: 'root',
})
export class BackgrounduploadsService {
    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);


    public getBackgrounds(params: BackgroundsParams): Observable<BackgroundsRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<BackgroundsRoot>(`${proxyPath}/map_module/backgroundUploads/backgrounds.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }


    public getMapUploadWithContainers(id: number): Observable<MapUploadEdit> {
        const proxyPath = this.proxyPath;
        return this.http.get<MapUploadEdit>(`${proxyPath}/map_module/backgroundUploads/editContainers/${id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public loadContainers(): Observable<LoadContainersRoot> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<LoadContainersRoot>(`${proxyPath}/map_module/backgroundUploads/loadContainers.json?angular=true`);
    }
}
