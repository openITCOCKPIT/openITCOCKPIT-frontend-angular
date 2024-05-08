import { TestBed } from '@angular/core/testing';

import { WeekdaysService } from './weekdays.service';

describe('WeekdaysService', () => {
  let service: WeekdaysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeekdaysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
