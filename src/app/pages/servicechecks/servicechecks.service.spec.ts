import { TestBed } from '@angular/core/testing';

import { ServicechecksService } from './servicechecks.service';

describe('ServicechecksService', () => {
  let service: ServicechecksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicechecksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
