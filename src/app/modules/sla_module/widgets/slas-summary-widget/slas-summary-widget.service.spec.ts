import { TestBed } from '@angular/core/testing';

import { SlasSummaryWidgetService } from './slas-summary-widget.service';

describe('SlasSummaryWidgetService', () => {
    let service: SlasSummaryWidgetService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SlasSummaryWidgetService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
