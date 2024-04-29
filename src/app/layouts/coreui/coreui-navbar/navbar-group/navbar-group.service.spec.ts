import { TestBed } from '@angular/core/testing';

import { NavbarGroupService } from './navbar-group.service';

describe('NavbarGroupService', () => {
  let service: NavbarGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavbarGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
