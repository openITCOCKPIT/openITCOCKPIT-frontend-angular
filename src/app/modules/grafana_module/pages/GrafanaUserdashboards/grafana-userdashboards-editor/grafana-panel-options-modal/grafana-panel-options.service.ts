import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { OpenPanelOptionsEvent } from '../grafana-panel/grafana-panel.component';

@Injectable({
    providedIn: 'root'
})
export class GrafanaPanelOptionsService {

    private readonly panel$$ = new Subject<OpenPanelOptionsEvent>();
    public readonly panel$ = this.panel$$.asObservable();

    constructor() {
    }

    /**
     * Call this method to open the panel options modal for a given panel
     * @param event
     */
    togglePanelOptionsModal(event: OpenPanelOptionsEvent): void {
        this.panel$$.next(event);
    }

}
