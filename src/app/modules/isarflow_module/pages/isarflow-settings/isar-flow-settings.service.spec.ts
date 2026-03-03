import { TestBed } from '@angular/core/testing';

import { IsarFlowSettingsService } from './isar-flow-settings.service';

describe('IsarFlowSettingsService', () => {
    let service: IsarFlowSettingsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(IsarFlowSettingsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
