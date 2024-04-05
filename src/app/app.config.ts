import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { LEGACY_BASE_URL } from "./tokens/legacy-base-url.token";
import { AuthService } from "./auth/auth.service";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { PROXY_PATH } from "./tokens/proxy-path.token";
import { authInterceptor } from "./auth/auth.interceptor";
import { csrfInterceptor } from "./auth/csrf.interceptor";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimations } from '@angular/platform-browser/animations';


export const appConfig: ApplicationConfig = {
  providers: [
    {provide: LEGACY_BASE_URL, useValue: '/#!'}, // Must be replaced by real staged URL
    {provide: PROXY_PATH, useValue: ''},
    {provide: AuthService, useClass: AuthService},
    provideHttpClient(
      withInterceptors([authInterceptor, csrfInterceptor]),
      /*
      withXsrfConfiguration({
        // cookieName: 'csrfToken',
        headerName: 'x-csrf-token',
      })

       */
    ),
    //importProvidersFrom(BrowserAnimationsModule),

    provideRouter(routes),
    provideAnimations(),
  ]
};
