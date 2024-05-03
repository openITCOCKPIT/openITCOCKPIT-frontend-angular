import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LayoutService {

    private theme$$: BehaviorSubject<'light' | 'dark'> = new BehaviorSubject<'light' | 'dark'>('light');

    // Subscribe to theme$ for layout changes
    public theme$: Observable<'light' | 'dark'> = this.theme$$.asObservable();

    constructor() {
    }

    public setTheme(theme: 'light' | 'dark'): void {
        this.theme$$.next(theme);
    }


}
