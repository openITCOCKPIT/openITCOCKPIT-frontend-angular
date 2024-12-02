import { TestBed } from '@angular/core/testing';

import { EvcTreeEditService } from './evc-tree-edit.service';

describe('EvcTreeEditService', () => {
  let service: EvcTreeEditService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvcTreeEditService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
