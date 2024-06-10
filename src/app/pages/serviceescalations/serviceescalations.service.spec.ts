import { TestBed } from '@angular/core/testing';

import { ServiceescalationsService } from './serviceescalations.service';

describe('ServiceescalationsService', () => {
  let service: ServiceescalationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceescalationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
