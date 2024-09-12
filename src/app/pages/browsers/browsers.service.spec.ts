import { TestBed } from '@angular/core/testing';

import { BrowsersService } from './browsers.service';

describe('BrowsersService', () => {
  let service: BrowsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrowsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
