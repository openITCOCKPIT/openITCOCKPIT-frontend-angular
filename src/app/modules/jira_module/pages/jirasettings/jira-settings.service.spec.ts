import { TestBed } from '@angular/core/testing';

import { JiraSettingsService } from './jira-settings.service';

describe('JiraSettingsService', () => {
    let service: JiraSettingsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(JiraSettingsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
