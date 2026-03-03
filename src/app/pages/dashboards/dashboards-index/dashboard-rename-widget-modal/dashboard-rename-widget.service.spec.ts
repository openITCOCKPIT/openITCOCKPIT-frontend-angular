import { TestBed } from '@angular/core/testing';

import { DashboardRenameWidgetService } from './dashboard-rename-widget.service';

describe('DashboardRenameWidgetService', () => {
    let service: DashboardRenameWidgetService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DashboardRenameWidgetService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
