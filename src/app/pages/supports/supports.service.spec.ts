import { TestBed } from '@angular/core/testing';

import { SupportsService } from './supports.service';

describe('SupportsService', () => {
    let service: SupportsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SupportsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
