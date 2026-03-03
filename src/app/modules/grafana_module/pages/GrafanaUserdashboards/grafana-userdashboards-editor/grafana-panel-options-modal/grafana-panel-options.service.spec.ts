import { TestBed } from '@angular/core/testing';

import { GrafanaPanelOptionsService } from './grafana-panel-options.service';

describe('GrafanaPanelOptionsService', () => {
    let service: GrafanaPanelOptionsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GrafanaPanelOptionsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
