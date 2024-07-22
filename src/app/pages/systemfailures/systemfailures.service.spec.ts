import { TestBed } from '@angular/core/testing';

import { SystemfailuresService } from './systemfailures.service';

describe('SystemfailuresService', () => {
  let service: SystemfailuresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SystemfailuresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
