import { TestBed } from '@angular/core/testing';

import { PushnotificationsrelayService } from './pushnotificationsrelay.service';

describe('PushnotificationsrelayService', () => {
  let service: PushnotificationsrelayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PushnotificationsrelayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
