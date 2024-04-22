import { inject, Injectable } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable, of } from "rxjs";
import { PROXY_PATH } from "../../tokens/proxy-path.token";
import { CommandIndexRoot, CommandPost, CommandsIndexParams } from './commands.interface';
import { DeleteAllItem, DeleteAllModalService } from '../../layouts/coreui/delete-all-modal/delete-all.interface';
import { GenericValidationError } from '../../generic-responses';

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

    public addCommand(command: CommandPost): Observable<boolean | GenericValidationError> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/commands/add.json?angular=true`, {
            Command: command
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return true;
                }),
                catchError((error: any) => {
                    const err = error.error.error as GenericValidationError;
                    return of(err);
                })
            );
    }

    public getEdit(id: number): Observable<CommandPost> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ command: CommandPost }>(`${proxyPath}/commands/edit/${id}.json?angular=true`).pipe(
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
