import { TestBed } from '@angular/core/testing';

import { ConfigurationFilesService } from './configuration-files.service';

describe('ConfigurationFilesService', () => {
    let service: ConfigurationFilesService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ConfigurationFilesService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
