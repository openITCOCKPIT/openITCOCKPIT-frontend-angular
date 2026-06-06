import { TestBed } from '@angular/core/testing';

import { DelayedPassiveHostsWidgetService } from './delayed-passive-hosts-widget.service';

describe('DelayedPassiveHostsWidgetService', () => {
    let service: DelayedPassiveHostsWidgetService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DelayedPassiveHostsWidgetService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
