import { TestBed } from '@angular/core/testing';

import { HostsBrowserModalService } from './hosts-browser-modal.service';

describe('HostsBrowserModalService', () => {
  let service: HostsBrowserModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HostsBrowserModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
