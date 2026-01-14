import { TestBed } from '@angular/core/testing';

import { EventcorrelationSettingsService } from './eventcorrelation-settings.service';

describe('EventcorrelationSettingsService', () => {
    let service: EventcorrelationSettingsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(EventcorrelationSettingsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
