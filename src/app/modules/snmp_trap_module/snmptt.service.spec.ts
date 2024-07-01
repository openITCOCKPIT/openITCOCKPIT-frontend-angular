import { TestBed } from '@angular/core/testing';

import { SnmpttService } from './snmptt.service';

describe('SnmpttService', () => {
  let service: SnmpttService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SnmpttService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
