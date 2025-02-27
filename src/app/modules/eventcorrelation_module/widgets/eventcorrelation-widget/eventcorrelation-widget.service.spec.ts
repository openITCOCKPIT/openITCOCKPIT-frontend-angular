import { TestBed } from '@angular/core/testing';

import { EventcorrelationWidgetService } from './eventcorrelation-widget.service';

describe('EventcorrelationWidgetService', () => {
  let service: EventcorrelationWidgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventcorrelationWidgetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
