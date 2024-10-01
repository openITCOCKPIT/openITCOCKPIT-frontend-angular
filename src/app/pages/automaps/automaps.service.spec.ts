import { TestBed } from '@angular/core/testing';

import { AutomapsService } from './automaps.service';

describe('AutomapsService', () => {
  let service: AutomapsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutomapsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
