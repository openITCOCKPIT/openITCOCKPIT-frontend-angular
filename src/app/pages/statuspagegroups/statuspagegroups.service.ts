import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { StatuspagegroupsIndex, StatuspagegroupsIndexParams } from './statuspagegroups.interface';

@Injectable({
    providedIn: 'root'
})
export class StatuspagegroupsService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getStatuspagegroups(params: StatuspagegroupsIndexParams): Observable<StatuspagegroupsIndex> {
        const proxyPath = this.proxyPath;
        return this.http.get<StatuspagegroupsIndex>(`${proxyPath}/statuspagegroups/index.json`, {
            params: params as {} // cast StatuspagegroupsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }
}
