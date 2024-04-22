import { inject, Injectable } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { PROXY_PATH } from "../../tokens/proxy-path.token";
import { CommandEdit, CommandIndexRoot, CommandsIndexParams } from './commands.interface';
import { DeleteAllItem, DeleteAllModalService } from '../../layouts/coreui/delete-all-modal/delete-all.interface';

@Injectable({
    providedIn: 'root',
})
export class CommandsService implements DeleteAllModalService {

    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);

    public getIndex(params: CommandsIndexParams): Observable<CommandIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<CommandIndexRoot>(`${proxyPath}/commands/index.json`, {
            params: params as {} // cast CommandsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getEdit(id: number): Observable<CommandEdit> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ command: CommandEdit }>(`${proxyPath}/commands/edit/${id}.json?angular=true`).pipe(
            map(data => {
                return data['command'];
            })
        )
    }

    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/commands/delete/${item.id}.json?angular=true`, {});
    }

}
