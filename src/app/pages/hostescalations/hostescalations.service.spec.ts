import { TestBed } from '@angular/core/testing';

import { HostescalationsService } from './hostescalations.service';

describe('HostescalationsService', () => {
    let service: HostescalationsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(HostescalationsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
