import { TestBed } from '@angular/core/testing';

import { GrafanaUserdefinedWidgetService } from './grafana-userdefined-widget.service';

describe('GrafanaUserdefinedWidgetService', () => {
  let service: GrafanaUserdefinedWidgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrafanaUserdefinedWidgetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
