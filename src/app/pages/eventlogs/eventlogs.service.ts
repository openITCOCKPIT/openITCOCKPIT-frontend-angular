import { inject, Injectable } from '@angular/core';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { EventlogsIndex, EventlogsIndexParams } from './eventlogs.interface';

// import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';

@Injectable({
    providedIn: 'root',
})
export class EventlogsService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getIndex(params: EventlogsIndexParams): Observable<EventlogsIndex> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<EventlogsIndex>(`${proxyPath}/eventlogs/index.json?`, {
            params: params as {}
        }).pipe(
            map((data: EventlogsIndex) => {
                return data;
            })
        )
    }
}
