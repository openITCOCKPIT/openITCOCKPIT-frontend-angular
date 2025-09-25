import { TestBed } from '@angular/core/testing';

import { OrganizationalchartWidgetService } from './organizationalchart-widget.service';

describe('OrganizationalchartWidgetService', () => {
  let service: OrganizationalchartWidgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrganizationalchartWidgetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
