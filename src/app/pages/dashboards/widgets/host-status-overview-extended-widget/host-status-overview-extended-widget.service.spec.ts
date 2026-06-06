import { TestBed } from '@angular/core/testing';

import { HostStatusOverviewExtendedWidgetService } from './host-status-overview-extended-widget.service';

describe('HostStatusOverviewWidgetService', () => {
    let service: HostStatusOverviewExtendedWidgetService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(HostStatusOverviewExtendedWidgetService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
