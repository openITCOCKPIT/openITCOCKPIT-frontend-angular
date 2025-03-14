import { TestBed } from '@angular/core/testing';

import { ExportRunningService } from './export-running.service';

describe('ExportRunningService', () => {
  let service: ExportRunningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportRunningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
