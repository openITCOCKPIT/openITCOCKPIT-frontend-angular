import { TestBed } from '@angular/core/testing';

import { SlaSummaryWidgetService } from './sla-summary-widget.service';

describe('SlaSummaryWidgetService', () => {
  let service: SlaSummaryWidgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SlaSummaryWidgetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
