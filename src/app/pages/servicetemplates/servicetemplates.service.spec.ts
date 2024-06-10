import { TestBed } from '@angular/core/testing';

import { ServicetemplatesService } from './servicetemplates.service';

describe('ServicetemplatesService', () => {
  let service: ServicetemplatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicetemplatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
