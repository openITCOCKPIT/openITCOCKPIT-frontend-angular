import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { OpenPanelOptionsEvent } from '../grafana-panel/grafana-panel.component';

@Injectable({
    providedIn: 'root'
})
export class GrafanaPanelOptionsService {

    private readonly panel$$ = new Subject<OpenPanelOptionsEvent>();
    public readonly panel$ = this.panel$$.asObservable();

    private readonly panelUpdated$$ = new Subject<OpenPanelOptionsEvent>();
    public readonly panelUpdated$ = this.panelUpdated$$.asObservable();

    constructor() {
    }

    /**
     * Call this method to open the panel options modal for a given panel
     * @param event
     */
    togglePanelOptionsModal(event: OpenPanelOptionsEvent): void {
        this.panel$$.next(event);
    }

    /**
     * Called by the Panel Options Modal to send the updated panel back to the Grafana Panel Component
     * @param event
     */
    sendUpdatedPanelToPanelComponent(event: OpenPanelOptionsEvent): void {
        this.panelUpdated$$.next(event);
    }

}
