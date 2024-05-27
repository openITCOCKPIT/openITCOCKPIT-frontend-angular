import { inject, Injectable } from '@angular/core';
import { DeleteAllItem, DeleteAllModalService } from '../../layouts/coreui/delete-all-modal/delete-all.interface';
import { catchError, map, Observable, of } from 'rxjs';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { HttpClient } from '@angular/common/http';
import {
    ContactCopyGet, ContactCopyPost,
    ContactPost,
    ContactsEditRoot,
    ContactsIndexParams,
    ContactsIndexRoot, ContactUsedBy, LdapConfigRoot, LoadLdapUserByStringRoot,
    LoadTimeperiodsPost,
    LoadTimeperiodsRoot,
    LoadContainersRoot
} from './contacts.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';

@Injectable({
    providedIn: 'root',
})

export class ContactsService implements DeleteAllModalService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    public getIndex(params: ContactsIndexParams): Observable<ContactsIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<ContactsIndexRoot>(`${proxyPath}/contacts/index.json`, {
            params: params as {} // cast ContactsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getEdit(id: number): Observable<ContactsEditRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<any>(`${proxyPath}/contacts/edit/${id}.json?angular=true`, {}).pipe(
            map(data => {
                return data;
            })
        )
    }


    public updateContact(contact: ContactPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/contacts/edit/${contact.id}.json?angular=true`, {
            Contact: contact
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

    public add(contact: ContactPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        console.warn(contact);
        return this.http.post<any>(`${proxyPath}/contacts/add.json?angular=true`, {
            Contact: contact
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

    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;

        return this.http.post(`${proxyPath}/contacts/delete/${item.id}.json?angular=true`, {});
    }

    public loadTimeperiods(params: LoadTimeperiodsPost): Observable<LoadTimeperiodsRoot> {
        const proxyPath = this.proxyPath;
        return this.http.post<LoadTimeperiodsRoot>(`${proxyPath}/contacts/loadTimeperiods.json?angular=true`,
            params as {}
        ).pipe(
            map(data => {
                return data;
            })
        )
    }

    public loadCommands(): Observable<any> {
        const proxyPath = this.proxyPath;
        return this.http.get<any>(`${proxyPath}/contacts/loadCommands.json?angular=true`, {}).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getContactsCopy(ids: number[]): Observable<ContactCopyGet[]> {
        const proxyPath = this.proxyPath;
        return this
            .http.get<{ contacts: ContactCopyGet [] }>(`${proxyPath}/contacts/copy/${ids.join('/')}.json?angular=true`)
            .pipe(
                map(data => {
                    return data.contacts;
                })
            )
    }


    public saveContactsCopy(contacts: ContactCopyPost[]): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/contacts/copy/.json?angular=true`, {
            data: contacts
        });
    }

    public usedBy(id: number): Observable<ContactUsedBy> {
        const proxyPath = this.proxyPath;
        return this
            .http.get<ContactUsedBy>(`${proxyPath}/contacts/usedBy/${id}.json?angular=true`)
            .pipe(
                map(data => {
                    return data;
                })
            )
    }

    public loadLdapUserByString(samaccountname: string): Observable<LoadLdapUserByStringRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<LoadLdapUserByStringRoot>(`${proxyPath}/contacts/loadLdapUserByString.json?angular=true&samaccountname=${samaccountname}`, {}).pipe(
            map(data => {
                return data;
            })
        )
    }

    public ldapConfiguration(): Observable<LdapConfigRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<LdapConfigRoot>(`${proxyPath}/angular/ldap_configuration.json?angular=true`, {}).pipe(
            map((data: LdapConfigRoot) => {
                return data;
            })
        )
    }

    public loadContainers(): Observable<LoadContainersRoot> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<LoadContainersRoot>(`${proxyPath}/contacts/loadContainers.json?angular=true`);
    }
}
