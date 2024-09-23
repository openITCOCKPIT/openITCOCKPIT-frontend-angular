import { TestBed } from '@angular/core/testing';

import { PrometheusQueryService } from './prometheus-query.service';

describe('PrometheusQueryService', () => {
  let service: PrometheusQueryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrometheusQueryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
