import { TestBed } from '@angular/core/testing';

import { ExportsService } from './exports.service';

describe('ExportsService', () => {
  let service: ExportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
