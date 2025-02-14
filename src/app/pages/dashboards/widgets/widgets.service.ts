import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { KtdGridLayout, KtdResizeEnd } from '@katoid/angular-grid-layout';

@Injectable({
    providedIn: 'root'
})
export class WidgetsService {

    private readonly onResizeEnded$$ = new Subject<KtdResizeEnd>();
    public readonly onResizeEnded$ = this.onResizeEnded$$.asObservable();

    private readonly onLayoutUpdated$$ = new Subject<KtdGridLayout>();
    public readonly onLayoutUpdated$ = this.onLayoutUpdated$$.asObservable();

    constructor() {
    }

    /**
     * Will be triggered when a single widget is resized
     * @param event KtdResizeEnd
     */
    onResizeEnded(event: KtdResizeEnd) {
        this.onResizeEnded$$.next(event);
    }

    /**
     * Will be triggered when the layout is updated
     * This can happen by resizing a widget, moving a widget or adding/removing a widget etc...
     * @param event KtdGridLayout
     */
    onLayoutUpdated(event: KtdGridLayout) {
        this.onLayoutUpdated$$.next(event);
    }

}
