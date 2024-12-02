import { TestBed } from '@angular/core/testing';

import { ImportersService } from './importers.service';

describe('ImportersService', () => {
  let service: ImportersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImportersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
