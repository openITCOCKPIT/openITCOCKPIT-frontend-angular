import { TestBed } from '@angular/core/testing';

import { TimeperiodsService } from './timeperiods.service';

describe('TimeperiodsService', () => {
    let service: TimeperiodsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TimeperiodsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
