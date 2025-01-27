import { TestBed } from '@angular/core/testing';

import { OpenstreetmapService } from './openstreetmap.service';

describe('OpenstreetmapService', () => {
  let service: OpenstreetmapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenstreetmapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
