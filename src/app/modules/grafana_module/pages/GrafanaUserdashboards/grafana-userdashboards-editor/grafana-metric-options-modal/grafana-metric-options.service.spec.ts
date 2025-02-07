import { TestBed } from '@angular/core/testing';

import { GrafanaMetricOptionsService } from './grafana-metric-options.service';

describe('GrafanaMetricOptionsService', () => {
  let service: GrafanaMetricOptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrafanaMetricOptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
