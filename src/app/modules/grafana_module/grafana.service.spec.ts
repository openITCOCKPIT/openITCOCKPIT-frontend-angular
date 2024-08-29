import { TestBed } from '@angular/core/testing';

import { GrafanaService } from './grafana.service';

describe('GrafanaService', () => {
  let service: GrafanaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrafanaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
