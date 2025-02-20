import { TestBed } from '@angular/core/testing';

import { WebsiteWidgetService } from './website-widget.service';

describe('WebsiteWidgetService', () => {
  let service: WebsiteWidgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebsiteWidgetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
