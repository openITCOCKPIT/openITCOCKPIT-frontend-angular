import { TestBed } from '@angular/core/testing';

import { HostsDowntimeWidgetService } from './hosts-downtime-widget.service';

describe('HostsDowntimeWidgetService', () => {
    let service: HostsDowntimeWidgetService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(HostsDowntimeWidgetService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
