import { TestBed } from '@angular/core/testing';

import { SlaWidgetService } from './sla-widget.service';

describe('SlaWidgetService', () => {
  let service: SlaWidgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SlaWidgetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
