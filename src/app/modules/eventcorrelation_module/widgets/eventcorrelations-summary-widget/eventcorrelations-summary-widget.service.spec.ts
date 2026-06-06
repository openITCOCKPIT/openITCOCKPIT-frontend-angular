import { TestBed } from '@angular/core/testing';

import { EventcorrelationsSummaryWidgetService } from './eventcorrelations-summary-widget.service';

describe('EventcorrelationsSummaryWidgetService', () => {
    let service: EventcorrelationsSummaryWidgetService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(EventcorrelationsSummaryWidgetService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
