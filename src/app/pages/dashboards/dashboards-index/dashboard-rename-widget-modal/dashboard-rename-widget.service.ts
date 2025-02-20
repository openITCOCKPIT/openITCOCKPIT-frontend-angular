import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DashboardRenameWidgetService {

    private readonly event$$ = new Subject<{ id: string, title: string }>();
    public readonly event$ = this.event$$.asObservable();

    constructor() {
    }

    /**
     * Call this method to open the widget rename modal
     * @param id The id of the widget
     * @param title The title of the widget
     */
    toggleRenameWidgetModal(id: string, title: string): void {
        this.event$$.next({
            id: id,
            title: title
        });
    }

}
