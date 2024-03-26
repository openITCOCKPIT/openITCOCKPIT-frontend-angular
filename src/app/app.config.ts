import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {LEGACY_BASE_URL} from "./tokens/legacy-base-url.token";
import {AuthService} from "./auth/auth.service";
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  provideHttpClient,
  withFetch,
  withInterceptors,
  withXsrfConfiguration
} from "@angular/common/http";
import {authInterceptor} from "./auth/auth.interceptor";
import {csrfInterceptor} from "./auth/csrf.interceptor";
import {API_URL} from "./tokens/api-url.token";

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LEGACY_BASE_URL, useValue: 'https://159.89.106.40' }, // Must be replaced by real staged URL
    { provide: API_URL, useValue: 'https://159.89.106.40' }, // Must be replaced by real staged URL
    { provide: AuthService, useClass: AuthService },
    provideHttpClient(
      withInterceptors([
        // authInterceptor,
      ]),
      withXsrfConfiguration({
        cookieName: 'x-csrf-token',
        headerName: 'csrfToken',
      })
    ),

    provideRouter(routes)
  ]
};
