import { TestBed } from '@angular/core/testing';

import { SystemHealthService } from './system-health.service';

describe('SystemHealthService', () => {
  let service: SystemHealthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SystemHealthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
