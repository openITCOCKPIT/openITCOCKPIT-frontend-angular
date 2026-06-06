import { TestBed } from '@angular/core/testing';

import { DelayedPassiveServicesWidgetService } from './delayed-passive-services-widget.service';

describe('DelayedPassiveServicesWidgetService', () => {
    let service: DelayedPassiveServicesWidgetService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DelayedPassiveServicesWidgetService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
