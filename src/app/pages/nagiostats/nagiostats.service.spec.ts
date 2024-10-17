import { TestBed } from '@angular/core/testing';

import { NagiostatsService } from './nagiostats.service';

describe('NagiostatsService', () => {
    let service: NagiostatsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(NagiostatsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
