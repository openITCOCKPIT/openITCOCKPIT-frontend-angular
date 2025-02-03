import { TestBed } from '@angular/core/testing';

import { ImportedhostsService } from './importedhosts.service';

describe('ImportedhostsService', () => {
  let service: ImportedhostsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImportedhostsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
