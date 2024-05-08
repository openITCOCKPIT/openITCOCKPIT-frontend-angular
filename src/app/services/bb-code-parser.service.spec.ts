import { TestBed } from '@angular/core/testing';

import { BbCodeParserService } from './bb-code-parser.service';

describe('BbCodeParserService', () => {
  let service: BbCodeParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BbCodeParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
