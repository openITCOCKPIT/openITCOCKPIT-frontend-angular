import { inject, Injectable, DOCUMENT } from "@angular/core";

import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, catchError, map, Observable, of, tap } from "rxjs";
import { PROXY_PATH } from "../tokens/proxy-path.token";
import { LoginResponse } from './auth.interface';
import { GenericValidationError } from '../generic-responses';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    public csrfToken: string | null = null;

    private readonly authenticated$$ = new BehaviorSubject(true);
    public readonly authenticated$ = this.authenticated$$.asObservable();

    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);

    public goToLogin(): void {
        this.document.location = `${this.proxyPath}/users/login`;
    }

    public goToLogout(): void {
        this.document.location = `${this.proxyPath}/users/logout`;
    }

    public login(email: string, password: string, rememberMe = true): Observable<LoginResponse> {
        const searchParams = new URLSearchParams();
        searchParams.set('email', email);
        searchParams.set('password', password);
        searchParams.set('_csrfToken', this.csrfToken as string);
        searchParams.set('remember_me', rememberMe ? '1' : '0');
        searchParams.set('_method', 'POST');

        return this.http.post<LoginResponse>(`${this.proxyPath}/users/login`, searchParams.toString(), {
            withCredentials: true,
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            }
        }).pipe(
            map(data => {
                // Return true on 200 Ok
                // For some reason angular is always calling the catchError callback ??
                // Not sure if this code gets ever executed but keep it the same as the catchError block

                // Tell the AuthService that we are authenticated
                this.authenticated$$.next(true);

                return {
                    success: true,
                    errors: {},
                };
            }),
            catchError((error: any) => {
                if (error.status === 200) {
                    // For whatever reason this can happen if a user is already logged in
                    // Not sure why angular is going to the error block here

                    // Tell the AuthService that we are authenticated
                    this.authenticated$$.next(true);

                    return of({
                        success: true,
                        errors: {},
                    });
                }

                const err = error.error.errors as GenericValidationError;
                return of({
                    success: false,
                    errors: err
                });
            })
        );
    }

    public logout(): void {
        console.log('logout');
        this.goToLogout();
    }

    public setUnauthorized(): void {
        this.authenticated$$.next(false);
    }

    /**
     * 18.11.2024 changed to private as it was not used
     * @private
     */
    private checkAuthentication(): Observable<boolean> {
        const proxyPath = this.proxyPath;

        return this.http.get<Record<string, string | boolean>>(`${proxyPath}/users/login.json`).pipe(
            map(data => data['isLoggedIn'] as boolean),
            catchError(error => {
                console.error(error);

                return of(false);
            }),
            tap(loggedIn => this.authenticated$$.next(loggedIn)),
        );
    }


}
