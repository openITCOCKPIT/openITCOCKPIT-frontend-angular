import { TestBed } from '@angular/core/testing';

import { EventcorrelationsService } from './eventcorrelations.service';

describe('EventcorrelationsService', () => {
  let service: EventcorrelationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventcorrelationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
