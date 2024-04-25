import { TestBed } from '@angular/core/testing';

import { UplotGraphService } from './uplot-graph.service';

describe('UplotGraphService', () => {
  let service: UplotGraphService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UplotGraphService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
