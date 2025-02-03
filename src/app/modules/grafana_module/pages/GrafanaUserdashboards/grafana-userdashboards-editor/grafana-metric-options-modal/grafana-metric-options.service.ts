import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { OpenMetricOptionsEvent } from '../grafana-panel/grafana-panel.component';

@Injectable({
    providedIn: 'root'
})
export class GrafanaMetricOptionsService {

    private readonly metric$$ = new Subject<OpenMetricOptionsEvent>();
    public readonly metric$ = this.metric$$.asObservable();

    constructor() {
    }

    /**
     * Call this method to open the metric add / edit modal for a given Metric
     * @param event
     */
    toggleMetricOptionsModal(event: OpenMetricOptionsEvent): void {
        this.metric$$.next(event);
    }
}
