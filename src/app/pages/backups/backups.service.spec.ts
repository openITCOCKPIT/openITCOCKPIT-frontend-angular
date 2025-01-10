import { TestBed } from '@angular/core/testing';

import { BackupsService } from './backups.service';

describe('BackupsService', () => {
  let service: BackupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackupsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
