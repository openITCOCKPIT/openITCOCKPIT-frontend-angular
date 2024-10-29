import { TestBed } from '@angular/core/testing';

import { ScansService } from './scans.service';

describe('ScansService', () => {
  let service: ScansService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScansService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
