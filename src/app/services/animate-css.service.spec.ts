import { TestBed } from '@angular/core/testing';

import { AnimateCssService } from './animate-css.service';

describe('AnimateCssService', () => {
  let service: AnimateCssService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnimateCssService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
