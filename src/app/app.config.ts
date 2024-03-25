import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {LEGACY_BASE_URL} from "./tokens/legacy-base-url.token";
import {AuthService} from "./auth/auth.service";

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LEGACY_BASE_URL, useValue: 'https://angularjs.org' }, // Must be replaced by real staged URL
    { provide: AuthService, useClass: AuthService },
    provideRouter(routes)
  ]
};
