import { TestBed } from '@angular/core/testing';

import { HostdefaultsService } from './hostdefaults.service';

describe('HostdefaultsService', () => {
  let service: HostdefaultsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HostdefaultsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
