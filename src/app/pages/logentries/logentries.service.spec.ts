import { TestBed } from '@angular/core/testing';

import { LogentriesService } from './logentries.service';

describe('LogentriesService', () => {
  let service: LogentriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogentriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
