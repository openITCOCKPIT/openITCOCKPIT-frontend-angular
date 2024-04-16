import { TestBed } from '@angular/core/testing';

import { GlobalLoadingService } from './global-loading.service';

describe('GlobalLoadingService', () => {
  let service: GlobalLoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalLoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
