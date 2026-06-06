import { TestBed } from '@angular/core/testing';

import { SlaCalendarWidgetService } from './sla-calendar-widget.service';

describe('SlaCalendarWidgetService', () => {
    let service: SlaCalendarWidgetService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SlaCalendarWidgetService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
