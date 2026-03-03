import { TestBed } from '@angular/core/testing';

import { ServiceStatusOverviewExtendedWidgetService } from './service-status-overview-extended-widget.service';

describe('HostStatusOverviewWidgetService', () => {
    let service: ServiceStatusOverviewExtendedWidgetService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ServiceStatusOverviewExtendedWidgetService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
