import { TestBed } from '@angular/core/testing';

import { CvesService } from './cves.service';

describe('CvesService', () => {
    let service: CvesService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CvesService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
