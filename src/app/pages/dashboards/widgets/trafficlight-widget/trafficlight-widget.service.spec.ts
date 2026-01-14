import { TestBed } from '@angular/core/testing';

import { TrafficlightWidgetService } from './trafficlight-widget.service';

describe('TrafficlightWidgetService', () => {
    let service: TrafficlightWidgetService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TrafficlightWidgetService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
