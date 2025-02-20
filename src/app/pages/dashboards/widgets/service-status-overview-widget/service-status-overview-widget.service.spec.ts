import { TestBed } from '@angular/core/testing';

import { ServiceStatusOverviewWidgetService } from './service-status-overview-widget.service';

describe('HostStatusOverviewWidgetService', () => {
  let service: ServiceStatusOverviewWidgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceStatusOverviewWidgetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
