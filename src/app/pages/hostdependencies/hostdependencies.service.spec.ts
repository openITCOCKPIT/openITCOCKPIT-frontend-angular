import { TestBed } from '@angular/core/testing';

import { HostdependenciesService } from './hostdependencies.service';

describe('HostdependenciesService', () => {
  let service: HostdependenciesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HostdependenciesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
