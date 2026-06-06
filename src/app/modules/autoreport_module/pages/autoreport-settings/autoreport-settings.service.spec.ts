import { TestBed } from '@angular/core/testing';

import { AutoreportSettingsService } from './autoreport-settings.service';

describe('AutreportsSettingsService', () => {
    let service: AutoreportSettingsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AutoreportSettingsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
