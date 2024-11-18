import { TestBed } from '@angular/core/testing';

import { ImportedFilesService } from './imported-files.service';

describe('ImportedFilesService', () => {
  let service: ImportedFilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImportedFilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
