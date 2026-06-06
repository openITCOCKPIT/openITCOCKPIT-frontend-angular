import { TestBed } from '@angular/core/testing';

import { BackgrounduploadsService } from './backgrounduploads.service';

describe('BackgrounduploadsService', () => {
    let service: BackgrounduploadsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(BackgrounduploadsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
