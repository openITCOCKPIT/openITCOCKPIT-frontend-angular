import {inject, Injectable, Signal, signal, WritableSignal} from "@angular/core";
import {DOCUMENT} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {switchMap, Observable, map, tap, catchError, of, BehaviorSubject} from "rxjs";
import {PROXY_PATH} from "../tokens/proxy-path.token";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly csrfToken: WritableSignal<string|null> = signal(null);

  private readonly authenticated$$ = new BehaviorSubject(true);
  public readonly authenticated$ = this.authenticated$$.asObservable();

  private readonly http = inject(HttpClient);
  private readonly document = inject(DOCUMENT);
  private readonly proxyPath = inject(PROXY_PATH);

  public goToLogin() {
    this.document.location = '/users/login';
  }

  public goToLogout() {
    this.document.location = '/users/logout';
  }

  public login(email: string, password: string, rememberMe = true): Observable<boolean> {
    const proxyPath = this.proxyPath;
    return this.http.get<Record<string, string>>(`${proxyPath}/users/login.json`).pipe(
      switchMap(data => {

        const csrfToken = data['_csrfToken'];
        const searchParams = new URLSearchParams();
        searchParams.set('email', email);
        searchParams.set('password', password);
        searchParams.set('_csrfToken', csrfToken);
        searchParams.set('remember_me', rememberMe ? '1' : '0');

        return this.http.post(`${proxyPath}/users/login`, searchParams.toString(), {
          responseType: 'text',
          withCredentials: true,
          headers: {
            // 'x-csrf-token': csrfToken,
            'content-type': 'application/x-www-form-urlencoded'
          }
        }).pipe(
          catchError(error => {
            console.error(error);

            return of(null);
          }),
          map((response) => !!response),
        );
      }),
      tap((loggedIn) => this.authenticated$$.next(loggedIn)),
    )
  }

  public logout(): void {
    this.goToLogout();
  }

  public setUnauthorized(): void {
    this.authenticated$$.next(false);
  }

  public checkAuthentication(): Observable<boolean> {
    const proxyPath = this.proxyPath;

    return this.http.get<Record<string, string|boolean>>(`${proxyPath}/users/login.json`).pipe(
      map(data => data['isLoggedIn'] as boolean),
      catchError(error => {
        console.error(error);

        return of(false);
      }),
      tap(loggedIn => this.authenticated$$.next(loggedIn)),
    );
  }
}
