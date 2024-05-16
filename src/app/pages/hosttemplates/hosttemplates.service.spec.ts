import { TestBed } from '@angular/core/testing';

import { HosttemplatesService } from './hosttemplates.service';

describe('HosttemplatesService', () => {
  let service: HosttemplatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HosttemplatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
