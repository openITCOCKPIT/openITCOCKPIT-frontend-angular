import { TestBed } from '@angular/core/testing';

import { DocumentationsService } from './documentations.service';

describe('DocumentationsService', () => {
  let service: DocumentationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
