import { TestBed } from '@angular/core/testing';

import { ExternalMonitoringsService } from './external-monitorings.service';

describe('ExternalMonitoringsService', () => {
    let service: ExternalMonitoringsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ExternalMonitoringsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
