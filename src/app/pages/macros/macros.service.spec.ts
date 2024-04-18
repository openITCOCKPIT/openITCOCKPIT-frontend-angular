import { TestBed } from '@angular/core/testing';

import { MacrosService } from './macros.service';

describe('MacrosService', () => {
  let service: MacrosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MacrosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
