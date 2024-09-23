import { TestBed } from '@angular/core/testing';

import { SystemnameService } from './systemname.service';

describe('SystemnameService', () => {
  let service: SystemnameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SystemnameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
