import { TestBed } from '@angular/core/testing';

import { MapSummaryToasterService } from './map-summary-toaster.service';

describe('MapSummaryToasterService', () => {
    let service: MapSummaryToasterService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MapSummaryToasterService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
