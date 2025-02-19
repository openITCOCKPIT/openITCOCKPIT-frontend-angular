import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HostsBrowserModalService {

    private readonly hostId$$ = new Subject<number>();
    public readonly hostId$ = this.hostId$$.asObservable();

    constructor() {
    }

    public openHostBrowserModal(hostId: number) {
        this.hostId$$.next(hostId);

    }
}
