import { TestBed } from '@angular/core/testing';

import { SatellitesService } from './satellites.service';

describe('SatellitesService', () => {
  let service: SatellitesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SatellitesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
