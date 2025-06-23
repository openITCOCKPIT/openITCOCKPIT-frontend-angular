import { TestBed } from '@angular/core/testing';

import { OrganizationalchartsService } from './organizationalcharts.service';

describe('OrganizationalchartsService', () => {
  let service: OrganizationalchartsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrganizationalchartsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
