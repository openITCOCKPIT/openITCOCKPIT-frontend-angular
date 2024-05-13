import { inject, Injectable } from '@angular/core';
import { DeleteAllItem, DeleteAllModalService } from '../../layouts/coreui/delete-all-modal/delete-all.interface';
import { catchError, map, Observable, of } from 'rxjs';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { HttpClient } from '@angular/common/http';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';
import {
    ContactgroupAddPost, ContactgroupAddPostContactgroup,
    ContactgroupEditPostContactgroup,
    ContactgroupsCopyGet,
    ContactgroupsCopyGetContactgroup,
    ContactgroupsCopyPost,
    ContactgroupsEditRoot,
    ContactgroupsIndexParams,
    ContactgroupsIndexRoot, ContactgroupsUsedByRoot, GetContactsByContainerIdRoot, GetContactsByContainerIdRootContact
} from './contactgroups.interface';

@Injectable({
    providedIn: 'root',
})

export class ContactgroupsService implements DeleteAllModalService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    public getIndex(params: ContactgroupsIndexParams): Observable<ContactgroupsIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<ContactgroupsIndexRoot>(`${proxyPath}/contactgroups/index.json`, {
            params: params as {} // cast ContactsIndexParams into object
        }).pipe(
            map((data: ContactgroupsIndexRoot) => {
                return data;
            })
        )
    }

    public getEdit(id: number): Observable<ContactgroupsEditRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<ContactgroupsEditRoot>(`${proxyPath}/contactgroups/edit/${id}.json?angular=true`, {}).pipe(
            map((data: ContactgroupsEditRoot) => {
                return data;
            })
        )
    }


    public updateContactgroup(contactgroup: ContactgroupEditPostContactgroup): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/contactgroups/edit/${contactgroup.id}.json?angular=true`, {
            Contactgroup: contactgroup
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

    public add(contact: ContactgroupAddPostContactgroup): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        const postObject = {
            Contactgroup: contact
        }
        return this.http.post<any>(`${proxyPath}/contactgroups/add.json?angular=true`, postObject)
            .pipe(
                map(data => {
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

    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;

        return this.http.post(`${proxyPath}/contactgroups/delete/${item.id}.json?angular=true`, {});
    }


    public getContactgroupsCopy(ids: number[]): Observable<ContactgroupsCopyGetContactgroup[]> {
        const proxyPath: string = this.proxyPath;
        return this
            .http.get<ContactgroupsCopyGet>(`${proxyPath}/contactgroups/copy/${ids.join('/')}.json?angular=true`)
            .pipe(
                map((data: ContactgroupsCopyGet) => {
                    return data.contactgroups;
                })
            )
    }

    public getContactsByContainerId(containerId: number): Observable<GetContactsByContainerIdRootContact[]> {
        const proxyPath: string = this.proxyPath;
        return this.http.post<GetContactsByContainerIdRoot>(`${proxyPath}/contactgroups/loadContacts/${containerId}.json?angular=true`, {})
            .pipe(
                map((data: GetContactsByContainerIdRoot) => {
                    return data.contacts;
                })
            );

    }


    public saveContactgroupsCopy(contacts: ContactgroupsCopyPost[]): Observable<Object> {
        const proxyPath: string = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/contactgroups/copy/.json?angular=true`, {
            data: contacts
        });
    }

    public usedBy(id: number): Observable<ContactgroupsUsedByRoot> {
        const proxyPath = this.proxyPath;
        return this
            .http.get<ContactgroupsUsedByRoot>(`${proxyPath}/contactgroups/usedBy/${id}.json?angular=true`)
            .pipe(
                map((data: ContactgroupsUsedByRoot) => {
                    return data;
                })
            )
    }

}
