import { TestBed } from '@angular/core/testing';

import { HostsStatusListWidgetService } from './hosts-status-list-widget.service';

describe('HostsStatusListWidgetService', () => {
    let service: HostsStatusListWidgetService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(HostsStatusListWidgetService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
