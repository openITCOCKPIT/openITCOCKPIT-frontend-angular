import { TestBed } from '@angular/core/testing';

import { TachometerWidgetService } from './tachometer-widget.service';

describe('TachometerWidgetService', () => {
    let service: TachometerWidgetService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TachometerWidgetService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
