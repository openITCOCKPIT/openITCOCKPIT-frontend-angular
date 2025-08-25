import { TestBed } from '@angular/core/testing';

import { MailinglistsService } from './mailinglists.service';

describe('MailinglistsService', () => {
  let service: MailinglistsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MailinglistsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
