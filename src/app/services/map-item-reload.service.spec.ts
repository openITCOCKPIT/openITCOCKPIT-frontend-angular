import { TestBed } from '@angular/core/testing';

import { MapItemReloadService } from './map-item-reload.service';

describe('MapItemReloadService', () => {
  let service: MapItemReloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapItemReloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
