import { TestBed } from '@angular/core/testing';

import { StatuspagegroupWidgetService } from './statuspagegroup-widget.service';

describe('StatuspagegroupWidgetService', () => {
  let service: StatuspagegroupWidgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatuspagegroupWidgetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
