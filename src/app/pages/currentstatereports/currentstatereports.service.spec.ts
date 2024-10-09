import { TestBed } from '@angular/core/testing';

import { CurrentstatereportsService } from './currentstatereports.service';

describe('CurrentstatereportsService', () => {
  let service: CurrentstatereportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentstatereportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
