import { TestBed } from '@angular/core/testing';

import { ServicenowService } from './servicenow.service';

describe('ServicenowService', () => {
  let service: ServicenowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicenowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
