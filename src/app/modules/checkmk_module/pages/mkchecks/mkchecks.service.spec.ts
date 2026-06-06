import { TestBed } from '@angular/core/testing';

import { MkchecksService } from './mkchecks.service';

describe('MkchecksService', () => {
    let service: MkchecksService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MkchecksService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
