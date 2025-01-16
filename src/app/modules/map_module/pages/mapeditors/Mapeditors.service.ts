import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { MapeditorsEditRoot } from './Mapeditors.interface';

@Injectable({
    providedIn: 'root'
})
export class MapeditorsService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getEdit(id: number): Observable<MapeditorsEditRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<any>(`${proxyPath}/map_module/mapeditors/edit/${id}.json?angular=true`, {}).pipe(
            map(data => {
                return data;
            })
        )
    }

}
