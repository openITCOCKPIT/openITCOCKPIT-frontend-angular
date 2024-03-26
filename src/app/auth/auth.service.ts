import {computed, inject, Injectable, Signal, signal, WritableSignal} from "@angular/core";
import {DOCUMENT} from "@angular/common";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Permission} from "../interfaces/permission.interface";
import {Router} from "@angular/router";
import {switchMap, Observable, EMPTY, map, tap, catchError, of} from "rxjs";
import {PROXY_PATH} from "../tokens/proxy-path.token";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly csrfToken: WritableSignal<string|null> = signal(null);
  private readonly permissions: WritableSignal<Permission[]|null> = signal([]);

  private readonly _authenticated: WritableSignal<boolean> = signal(false);
  public readonly authenticated: Signal<boolean> = computed(() => {
    return this._authenticated();
  });

  private readonly http = inject(HttpClient);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly proxyPath = inject(PROXY_PATH);

  public goToLogin() {
    this.document.location = '/users/login';
  }

  public goToLogout() {
    this.document.location = '/users/logout';
  }

  public login(email: string, password: string): Observable<boolean> {
    const proxyPath = this.proxyPath;
    return this.http.get<Record<string, string>>(`${proxyPath}/users/login.json`).pipe(
      switchMap(data => {

        const csrfToken = data['_csrfToken'];
        const searchParams = new URLSearchParams();
        searchParams.set('email', email);
        searchParams.set('password', password);
        searchParams.set('_csrfToken', csrfToken);
        searchParams.set('remember_me', '1');

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
      tap((loggedIn) => this._authenticated.set(loggedIn)),
    )
  }

  public logout(): void {
    console.log('logout');
    this.goToLogout();
  }

  public checkAuthentication(): Observable<boolean> {
    const proxyPath = this.proxyPath;

    return this.http.get<Record<string, string|boolean>>(`${proxyPath}/users/login.json`).pipe(
      map(data => data['isLoggedIn'] as boolean),
      catchError(error => {
        console.error(error);

        return of(false);
      }),
      tap(loggedIn => this._authenticated.set(loggedIn)),
    );
  }
}
