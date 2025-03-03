import { TestBed } from '@angular/core/testing';

import { SlackSettingsService } from './slack-settings.service';

describe('SlackSettingsService', () => {
  let service: SlackSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SlackSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
