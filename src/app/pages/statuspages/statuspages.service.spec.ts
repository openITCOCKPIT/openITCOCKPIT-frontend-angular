import { TestBed } from '@angular/core/testing';

import { StatuspagesService } from './statuspages.service';

describe('StatuspagesService', () => {
    let service: StatuspagesService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(StatuspagesService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
