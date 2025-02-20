import { TestBed } from '@angular/core/testing';

import { ServicesStatusListWidgetService } from './services-status-list-widget.service';

describe('ServicesStatusListWidgetService', () => {
  let service: ServicesStatusListWidgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicesStatusListWidgetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
