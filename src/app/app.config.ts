import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {LEGACY_BASE_URL} from "./tokens/legacy-base-url.token";
import {AuthService} from "./auth/auth.service";
import {
  provideHttpClient,
  withInterceptors,
  withXsrfConfiguration
} from "@angular/common/http";
import {PROXY_PATH} from "./tokens/proxy-path.token";
import {authInterceptor} from "./auth/auth.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LEGACY_BASE_URL, useValue: '' }, // Must be replaced by real staged URL
    { provide: PROXY_PATH, useValue: '/api' },
    { provide: AuthService, useClass: AuthService },
    provideHttpClient(
      withInterceptors([authInterceptor]),
      withXsrfConfiguration({
        cookieName: 'csrfToken',
        headerName: 'x-csrf-token',
      })
    ),

    provideRouter(routes)
  ]
};
