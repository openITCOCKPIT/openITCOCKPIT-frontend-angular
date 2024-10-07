import { TestBed } from '@angular/core/testing';

import { StatusmapService } from './statusmap.service';

describe('StatusmapService', () => {
  let service: StatusmapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatusmapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
