import { TestBed } from '@angular/core/testing';

import { ResourcegroupsSummaryService } from './resourcegroups-summary.service';

describe('ResourcegroupsSummaryService', () => {
  let service: ResourcegroupsSummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourcegroupsSummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
