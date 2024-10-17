import { TestBed } from '@angular/core/testing';

import { InstantreportsService } from './instantreports.service';

describe('InstantreportsService', () => {
    let service: InstantreportsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(InstantreportsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
