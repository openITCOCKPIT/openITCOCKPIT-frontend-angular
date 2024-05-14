import { TestBed } from '@angular/core/testing';

import { RegistersService } from './registers.service';

describe('RegistersService', () => {
  let service: RegistersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
