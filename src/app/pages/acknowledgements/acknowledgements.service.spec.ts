import { TestBed } from '@angular/core/testing';

import { AcknowledgementsService } from './acknowledgements.service';

describe('AcknowledgementsService', () => {
    let service: AcknowledgementsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AcknowledgementsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
