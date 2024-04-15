import { TestBed } from '@angular/core/testing';

import { SelectionServiceService } from './selection-service.service';

describe('SelectionServiceService', () => {
  let service: SelectionServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectionServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
