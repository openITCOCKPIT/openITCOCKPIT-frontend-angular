import { TestBed } from '@angular/core/testing';

import { ServicedependenciesService } from './servicedependencies.service';

describe('ServicedependenciesService', () => {
  let service: ServicedependenciesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicedependenciesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
