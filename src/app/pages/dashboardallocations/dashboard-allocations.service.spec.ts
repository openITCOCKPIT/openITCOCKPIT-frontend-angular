import { TestBed } from '@angular/core/testing';

import { DashboardAllocationsService } from './dashboard-allocations.service';

describe('DashboardAllocationsService', () => {
    let service: DashboardAllocationsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DashboardAllocationsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
