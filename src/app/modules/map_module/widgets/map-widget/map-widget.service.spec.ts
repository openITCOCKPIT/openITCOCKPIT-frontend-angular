import { TestBed } from '@angular/core/testing';

import { MapWidgetService } from './map-widget.service';

describe('MapWidgetService', () => {
    let service: MapWidgetService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MapWidgetService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
