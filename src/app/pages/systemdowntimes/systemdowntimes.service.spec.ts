import { TestBed } from '@angular/core/testing';

import { SystemdowntimesService } from './systemdowntimes.service';

describe('SystemdowntimesService', () => {
    let service: SystemdowntimesService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SystemdowntimesService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
