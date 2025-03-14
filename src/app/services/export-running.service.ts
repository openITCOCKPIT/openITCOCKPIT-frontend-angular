import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export enum LayoutOptions {
    Default = 'default',
    Blank = 'blank'
}

@Injectable({
    providedIn: 'root'
})

export class ExportRunningService {

    private isRunningExport$$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isRunningExport$: Observable<boolean> = this.isRunningExport$$.asObservable();

    constructor() {
    }

    public setIsRunning(running: boolean): void {
        this.isRunningExport$$.next(running);
    }
}
