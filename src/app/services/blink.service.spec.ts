import { TestBed } from '@angular/core/testing';

import { BlinkService } from './blink.service';

describe('BlinkService', () => {
  let service: BlinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
