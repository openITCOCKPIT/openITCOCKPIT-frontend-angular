import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import {
    AutomapCopyPost,
    AutomapEntity,
    AutomapsIndexParams,
    AutomapsIndexRoot,
    AutomapsMatchingHostAndServiceCounts,
    AutomapsViewParams,
    AutomapsViewRoot
} from './automaps.interface';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';
import { SelectKeyValue, SelectKeyValueString } from '../../layouts/primeng/select.interface';
import { TranslocoService } from '@jsverse/transloco';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export class AutomapsService {

    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService)

    public getIndex(params: AutomapsIndexParams): Observable<AutomapsIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<AutomapsIndexRoot>(`${proxyPath}/automaps/index.json`, {
            params: params as {} // cast AutomapsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/automaps/delete/${item.id}.json?angular=true`, {});
    }

    public getAutomapsCopy(ids: number[]): Observable<AutomapEntity[]> {
        const proxyPath = this.proxyPath;
        return this
            .http.get<{ automaps: AutomapEntity[] }>(`${proxyPath}/automaps/copy/${ids.join('/')}.json?angular=true`)
            .pipe(
                map(data => {
                    return data.automaps;
                })
            )
    }


    public saveAutomapsCopy(automaps: AutomapCopyPost[]): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/automaps/copy/.json?angular=true`, {
            data: automaps
        });
    }

    public loadContainers(): Observable<SelectKeyValue[]> {
        const proxyPath = this.proxyPath;
        return this
            .http.get<{ containers: SelectKeyValue[] }>(`${proxyPath}/automaps/loadContainers.json`, {
                params: {
                    angular: true
                }
            })
            .pipe(
                map(data => {
                    return data.containers;
                })
            )
    }

    public getMatchingHostAndServices(automap: AutomapEntity): Observable<AutomapsMatchingHostAndServiceCounts> {
        const proxyPath = this.proxyPath;
        return this.http.post<AutomapsMatchingHostAndServiceCounts>(`${proxyPath}/automaps/getMatchingHostAndServices.json?angular=true`, {
            Automap: automap
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getFontSizes(): SelectKeyValueString[] {
        return [
            {
                key: "1",
                value: this.TranslocoService.translate('Smallest')
            },
            {
                key: "2",
                value: this.TranslocoService.translate('Smaller')
            },
            {
                key: "3",
                value: this.TranslocoService.translate('Small')
            },
            {
                key: "4",
                value: this.TranslocoService.translate('Normal')
            },
            {
                key: "5",
                value: this.TranslocoService.translate('Big')
            },
            {
                key: "6",
                value: this.TranslocoService.translate('Bigger')
            },
            {
                key: "7",
                value: this.TranslocoService.translate('Biggest')
            },
        ];
    }

    public add(automap: AutomapEntity): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/automaps/add.json?angular=true`, {
            Automap: automap
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data.automap as GenericIdResponse
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

    public getAutomapEdit(id: number): Observable<AutomapEntity> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ automap: AutomapEntity }>(`${proxyPath}/automaps/edit/${id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.automap;
            })
        );
    }

    public saveAutomapEdit(automap: AutomapEntity): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/automaps/edit/${automap.id}.json?angular=true`, {
            Automap: automap
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data.automap as GenericIdResponse
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

    public view(id: number, params: AutomapsViewParams): Observable<AutomapsViewRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<AutomapsViewRoot>(`${proxyPath}/automaps/view/${id}.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        );
    }

}
