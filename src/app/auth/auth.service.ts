import { inject, Injectable } from "@angular/core";
import { DOCUMENT } from "@angular/common";
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
            tap((response) => {
                // Optionally handle successful login state here
                this.authenticated$$.next(true);
            }),
            catchError(error => {
                const err = error.error.errors as GenericValidationError;
                return of({
                    success: error.status === 200,
                    errors: err
                } as unknown as LoginResponse);
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

    public checkAuthentication(): Observable<boolean> {
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
