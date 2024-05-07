import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { ProfileApiRoot, ProfileUser } from './profile.interface';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import {
    GenericIdResponse,
    GenericResponseWrapper,
    GenericSuccessResponse,
    GenericValidationError
} from '../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getProfile(): Observable<ProfileApiRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<ProfileApiRoot>(`${proxyPath}/profile/edit.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public updateProfile(user: ProfileUser): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<{ user: ProfileUser }>(`${proxyPath}/profile/edit.json?angular=true`, {
            User: user
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: {
                            id: user.id
                        } as GenericIdResponse
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

    public deleteUserImage(): Observable<GenericSuccessResponse> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/profile/deleteImage.json?angular=true`, {})
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true
                    };
                }),
                catchError((error: any) => {
                    return of({
                        success: false
                    })
                })
            );
    }

}
