import { TestBed } from '@angular/core/testing';

import { HostStatusOverviewWidgetService } from './host-status-overview-widget.service';

describe('HostStatusOverviewWidgetService', () => {
  let service: HostStatusOverviewWidgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HostStatusOverviewWidgetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
