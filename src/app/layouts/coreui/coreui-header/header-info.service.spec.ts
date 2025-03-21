import { TestBed } from '@angular/core/testing';

import { HeaderInfoService } from './header-info.service';

describe('HeaderInfoService', () => {
  let service: HeaderInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeaderInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
