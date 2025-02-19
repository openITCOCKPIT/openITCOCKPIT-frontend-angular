import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ServiceBrowserModalService {

    private readonly serviceId$$ = new Subject<number>();
    public readonly serviceId$ = this.serviceId$$.asObservable();

    constructor() {
    }

    public openServiceBrowserModal(serviceId: number) {
        this.serviceId$$.next(serviceId);

    }

}
