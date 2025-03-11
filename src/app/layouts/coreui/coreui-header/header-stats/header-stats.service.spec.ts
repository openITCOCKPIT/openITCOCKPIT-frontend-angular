import { TestBed } from '@angular/core/testing';

import { HeaderStatsService } from './header-stats.service';

describe('HeaderStatsService', () => {
  let service: HeaderStatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeaderStatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
