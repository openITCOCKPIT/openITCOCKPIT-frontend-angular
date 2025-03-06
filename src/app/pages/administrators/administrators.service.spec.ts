import { TestBed } from '@angular/core/testing';

import { AdministratorsService } from './administrators.service';

describe('AdministratorsService', () => {
  let service: AdministratorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdministratorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
