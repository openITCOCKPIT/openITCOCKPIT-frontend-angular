import { TestBed } from '@angular/core/testing';

import { BrowserSoftwareService } from './browser-software.service';

describe('BrowserSoftwareService', () => {
  let service: BrowserSoftwareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrowserSoftwareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
