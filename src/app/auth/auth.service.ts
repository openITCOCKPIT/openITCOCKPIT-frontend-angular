import {computed, inject, Injectable, Signal, signal, WritableSignal} from "@angular/core";
import {DOCUMENT} from "@angular/common";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Permission} from "../interfaces/permission.interface";
import {Router} from "@angular/router";
import {API_URL} from "../tokens/api-url.token";
import {switchMap, Observable, EMPTY, map, tap, catchError, of} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly csrfToken: WritableSignal<string|null> = signal(null);
  private readonly permissions: WritableSignal<Permission[]|null> = signal([]);
  public readonly authenticated: Signal<boolean> = computed(() => {
    return !!this.permissions();
  });

  private readonly http = inject(HttpClient);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly apiUrl = inject(API_URL);

  public goToLogin() {
    this.document.location = '/users/login';
  }

  public goToLogout() {
    this.document.location = '/users/logout';
  }

  public login(email: string, password: string): Observable<boolean> {
    return this.http.get<Record<string, string>>(`/api/users/login.json`).pipe(
      switchMap(data => {

        const csrfToken = data['_csrfToken'];
        const searchParams = new URLSearchParams();
        searchParams.set('email', email);
        searchParams.set('password', password);
        searchParams.set('_csrfToken', csrfToken);
        searchParams.set('remember_me', '1');

        return this.http.post(`/api/users/login`, searchParams.toString(), {
          responseType: 'text',
          withCredentials: true,
          headers: {
            'x-csrf-token': csrfToken,
            'content-type': 'application/x-www-form-urlencoded'
          }
        }).pipe(
          catchError(error => {
            console.error(error);

            return of(null);
          }),
          map(() => csrfToken),
        );
      }),
      tap((token) => this.csrfToken.set(token)),
      map((token) => !!token),
    )
  }

  public logout(): void {
    this.permissions.set(null);
  }

  public checkAuthentication(): Observable<unknown> {
    const apiUrl = this.apiUrl;

    return this.http.get<unknown>(`${apiUrl}/api/users/login.json`, {
      withCredentials: true,
    });
  }
}



