import { TestBed } from '@angular/core/testing';

import { DashboardsService } from './dashboards.service';

describe('DashboardsService', () => {
  let service: DashboardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
