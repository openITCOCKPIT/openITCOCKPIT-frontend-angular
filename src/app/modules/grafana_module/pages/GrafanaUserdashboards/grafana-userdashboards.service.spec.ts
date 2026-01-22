import { TestBed } from '@angular/core/testing';

import { GrafanaUserdashboardsService } from './grafana-userdashboards.service';

describe('GrafanaUserdashboardsService', () => {
    let service: GrafanaUserdashboardsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GrafanaUserdashboardsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
