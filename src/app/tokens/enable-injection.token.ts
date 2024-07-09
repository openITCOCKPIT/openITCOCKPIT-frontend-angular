// To make ModalComponent generic and able to accept different services,
// we use Angular's Dependency Injection (DI) system. You can inject a service into the component
// using the @Inject decorator. However, since we want to make it generic, we'll need to use a token to
// represent the service that will be injected.

import { InjectionToken } from '@angular/core';

export const ENABLE_SERVICE_TOKEN = new InjectionToken('enableService');
