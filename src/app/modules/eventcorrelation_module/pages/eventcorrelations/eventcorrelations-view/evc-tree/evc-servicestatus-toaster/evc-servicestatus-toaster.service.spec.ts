import { TestBed } from '@angular/core/testing';

import { EvcServicestatusToasterService } from './evc-servicestatus-toaster.service';

describe('EvcServicestatusToasterService', () => {
    let service: EvcServicestatusToasterService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(EvcServicestatusToasterService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
