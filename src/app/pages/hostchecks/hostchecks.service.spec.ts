import { TestBed } from '@angular/core/testing';

import { HostchecksService } from './hostchecks.service';

describe('HostchecksService', () => {
  let service: HostchecksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HostchecksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
