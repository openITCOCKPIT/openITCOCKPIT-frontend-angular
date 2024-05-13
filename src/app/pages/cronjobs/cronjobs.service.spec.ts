import { TestBed } from '@angular/core/testing';

import { CronjobsService } from './cronjobs.service';

describe('CronjobsService', () => {
  let service: CronjobsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CronjobsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
