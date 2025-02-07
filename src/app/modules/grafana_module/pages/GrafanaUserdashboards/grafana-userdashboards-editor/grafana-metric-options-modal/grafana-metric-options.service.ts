import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MetricUpdatedEvent, OpenMetricOptionsEvent } from '../grafana-panel/grafana-panel.component';

@Injectable({
    providedIn: 'root'
})
export class GrafanaMetricOptionsService {

    private readonly metric$$ = new Subject<OpenMetricOptionsEvent>();
    public readonly metric$ = this.metric$$.asObservable();

    private readonly metricUpdated$$ = new Subject<MetricUpdatedEvent>();
    public readonly metricUpdated$ = this.metricUpdated$$.asObservable();

    constructor() {
    }

    /**
     * Call this method to open the metric add / edit modal for a given Metric
     * @param event
     */
    public toggleMetricOptionsModal(event: OpenMetricOptionsEvent): void {
        this.metric$$.next(event);
    }

    /**
     * Gets called by the metric options modal component when a metric was added or updated
     * @param metricEvent
     */
    public sendUpdatedMetricToPanelComponent(metricEvent: MetricUpdatedEvent) {
        this.metricUpdated$$.next(metricEvent);
    }
}
