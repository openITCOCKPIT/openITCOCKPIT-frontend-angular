import { TestBed } from '@angular/core/testing';

import { StatuspagegroupsService } from './statuspagegroups.service';

describe('StatuspagegroupsService', () => {
    let service: StatuspagegroupsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(StatuspagegroupsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
