import { TestBed } from '@angular/core/testing';

import { OpenstreetmapToasterService } from './openstreetmap-toaster.service';

describe('OpenstreetmapToasterService', () => {
  let service: OpenstreetmapToasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenstreetmapToasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
