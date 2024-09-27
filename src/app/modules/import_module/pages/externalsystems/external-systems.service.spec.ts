import { TestBed } from '@angular/core/testing';

import { ExternalSystemsService } from './external-systems.service';

describe('ExternalSystemsService', () => {
  let service: ExternalSystemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExternalSystemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
