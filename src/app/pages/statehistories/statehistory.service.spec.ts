import { TestBed } from '@angular/core/testing';

import { StatehistoryService } from './statehistory.service';

describe('StatehistoryService', () => {
  let service: StatehistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatehistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
