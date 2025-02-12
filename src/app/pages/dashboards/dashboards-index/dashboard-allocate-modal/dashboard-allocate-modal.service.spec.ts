import { TestBed } from '@angular/core/testing';

import { DashboardAllocateModalService } from './dashboard-allocate-modal.service';

describe('DashboardAllocateModalService', () => {
  let service: DashboardAllocateModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardAllocateModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
