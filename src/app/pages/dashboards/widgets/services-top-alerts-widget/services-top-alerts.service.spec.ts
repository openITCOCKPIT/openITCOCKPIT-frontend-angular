import { TestBed } from '@angular/core/testing';

import { ServicesTopAlertsService } from './services-top-alerts.service';

describe('ServicesTopAlertsService', () => {
    let service: ServicesTopAlertsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ServicesTopAlertsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
