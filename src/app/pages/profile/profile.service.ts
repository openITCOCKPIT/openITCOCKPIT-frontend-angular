import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import {
    ProfileApikey,
    ProfileApiRoot,
    ProfileCreateApiKey,
    ProfilePasswordPost,
    ProfileUser
} from './profile.interface';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import {
    GenericIdResponse,
    GenericMessageResponse,
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

    public changePassword(password: ProfilePasswordPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<{ user: ProfileUser }>(`${proxyPath}/profile/changePassword.json?angular=true`, {
            Password: password
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: {
                            success: true
                        } as GenericSuccessResponse
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

    public getApiKeys(): Observable<ProfileApikey[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ apikeys: ProfileApikey[] }>(`${proxyPath}/profile/apikey.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.apikeys;
            })
        )
    }

    public generateNewApiKey(): Observable<ProfileCreateApiKey> {
        const proxyPath = this.proxyPath;
        return this.http.get<ProfileCreateApiKey>(`${proxyPath}/profile/create_apikey.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public saveNewApiKey(description: string): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<{ message: string }>(`${proxyPath}/profile/create_apikey.json?angular=true`, {
            Apikey: {
                description: description // The backend tracks the API Key in the session for security reasons
            }
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: {
                            message: data.message
                        } as GenericMessageResponse
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

    public updateApiKey(id: number, description: string): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<{ message: string }>(`${proxyPath}/profile/apikey.json?angular=true`, {
            Apikey: {
                id: id,
                description: description // we can only change the description
            }
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: {
                            message: data.message
                        } as GenericMessageResponse
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

    public deleteApiKey(id: number): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<{ message: string }>(`${proxyPath}/profile/delete_apikey/${id}/.json?angular=true`, {})
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: {
                            message: data.message
                        } as GenericMessageResponse
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

    public getApiKeyEdit(id: number): Observable<{ apikey: ProfileApikey, qrcode: string }> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ apikey: ProfileApikey, qrcode: string }>(`${proxyPath}/profile/apikey.json`, {
            params: {
                angular: true,
                id: id
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

}
