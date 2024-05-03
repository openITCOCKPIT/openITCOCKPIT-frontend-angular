import { inject, Injectable } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable, of } from "rxjs";
import { PROXY_PATH } from "../../tokens/proxy-path.token";
import {
    CommandCopyGet,
    CommandCopyPost,
    CommandEditGet,
    CommandIndexRoot,
    CommandPost,
    CommandsIndexParams
} from './commands.interface';
import { DeleteAllItem, DeleteAllModalService } from '../../layouts/coreui/delete-all-modal/delete-all.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';
import { DefaultMacros } from "../../components/code-mirror-container/code-mirror-container.interface";

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

    public createCommand(command: CommandPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/commands/add.json?angular=true`, {
            Command: command
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data as GenericIdResponse
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

    public getAdd(): Observable<DefaultMacros[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ defaultMacros: DefaultMacros[] }>(`${proxyPath}/commands/add/.json?angular=true`).pipe(
            map(data => {
                return data['defaultMacros'];
            })
        )
    }

    public getEdit(id: number): Observable<CommandEditGet> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            command: CommandPost,
            defaultMacros: DefaultMacros[]
        }>(`${proxyPath}/commands/edit/${id}.json?angular=true`).pipe(
            map(data => {
                return data;
            })
        )
    }

    public updateCommand(command: CommandPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/commands/edit/${command.id}.json?angular=true`, {
            Command: command
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data as GenericIdResponse
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

    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/commands/delete/${item.id}.json?angular=true`, {});
    }

    public getCommandsCopy(ids: number[]): Observable<CommandCopyGet[]> {
        const proxyPath = this.proxyPath;
        return this
            .http.get<{ commands: CommandCopyGet[] }>(`${proxyPath}/commands/copy/${ids.join('/')}.json?angular=true`)
            .pipe(
                map(data => {
                    return data.commands;
                })
            )
    }


    public saveCommandsCopy(commands: CommandCopyPost[]): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/commands/copy/.json?angular=true`, {
            data: commands
        });
    }

}
