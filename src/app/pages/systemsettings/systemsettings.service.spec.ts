import { TestBed } from '@angular/core/testing';

import { SystemsettingsService } from './systemsettings.service';

describe('SystemsettingsService', () => {
  let service: SystemsettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SystemsettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
