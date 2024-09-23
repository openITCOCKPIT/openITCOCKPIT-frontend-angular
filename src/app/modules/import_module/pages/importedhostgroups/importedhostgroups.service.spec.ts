import { TestBed } from '@angular/core/testing';

import { ImportedhostgroupsService } from './importedhostgroups.service';

describe('ImportedhostgroupsService', () => {
  let service: ImportedhostgroupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImportedhostgroupsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
