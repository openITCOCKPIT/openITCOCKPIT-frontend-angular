import { TestBed } from '@angular/core/testing';

import { ResourcegroupsService } from './resourcegroups.service';

describe('ResourcegroupsService', () => {
  let service: ResourcegroupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourcegroupsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
