import { TestBed } from '@angular/core/testing';

import { DowntimesService } from './downtimes.service';

describe('DowntimesService', () => {
    let service: DowntimesService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DowntimesService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
