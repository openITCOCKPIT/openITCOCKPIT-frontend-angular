import { DOCUMENT, inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


export enum LayoutOptions {
    Default = 'default',
    Blank = 'blank',
    Kiosk = 'kiosk'
}

@Injectable({
    providedIn: 'root'
})
export class LayoutService {

    private theme$$: BehaviorSubject<'light' | 'dark'> = new BehaviorSubject<'light' | 'dark'>('light');

    // Subscribe to theme$ for layout changes
    public theme$: Observable<'light' | 'dark'> = this.theme$$.asObservable();

    // The "default" layout uses CoreUI with navbar, header and content area.
    // The blank layout also uses CoreUI, but hides the navbar and header
    private layout$$: BehaviorSubject<LayoutOptions> = new BehaviorSubject<LayoutOptions>(LayoutOptions.Default);
    public layout$: Observable<LayoutOptions> = this.layout$$.asObservable();

    private readonly document = inject(DOCUMENT);

    constructor() {
    }

    public setTheme(theme: 'light' | 'dark'): void {
        this.theme$$.next(theme);

        if (theme === 'dark') {
            // Load dark theme via CSS class
            this.document.body.classList.add('dark-theme');

            // Tell PrimeNG that we are in dark mode
            this.document.querySelector("html")!.classList.add("dark-theme");
        } else {
            this.document.body.classList.remove('dark-theme');
            this.document.querySelector("html")!.classList.remove("dark-theme");
        }

    }

    public setLayout(layout: LayoutOptions): void {
        this.layout$$.next(layout);
    }

}
