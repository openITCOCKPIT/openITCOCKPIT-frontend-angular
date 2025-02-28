import { TestBed } from '@angular/core/testing';

import { ScmsettingsService } from './scmsettings.service';

describe('ScmsettingsService', () => {
  let service: ScmsettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScmsettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
