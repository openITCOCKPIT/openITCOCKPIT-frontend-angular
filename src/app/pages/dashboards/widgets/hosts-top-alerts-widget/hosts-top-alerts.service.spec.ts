import { TestBed } from '@angular/core/testing';

import { HostsTopAlertsService } from './hosts-top-alerts.service';

describe('HostsTopAlertsService', () => {
    let service: HostsTopAlertsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(HostsTopAlertsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
