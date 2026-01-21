import { TestBed } from '@angular/core/testing';

import { PatchstatusService } from './patchstatus.service';

describe('PatchstatusService', () => {
  let service: PatchstatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatchstatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
