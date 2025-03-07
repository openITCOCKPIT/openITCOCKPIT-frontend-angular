import { TestBed } from '@angular/core/testing';

import { DesignsService } from './designs.service';

describe('DesignsService', () => {
  let service: DesignsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DesignsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
