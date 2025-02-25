import { TestBed } from '@angular/core/testing';

import { AutomapWidgetService } from './automap-widget.service';

describe('AutomapWidgetService', () => {
  let service: AutomapWidgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutomapWidgetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
