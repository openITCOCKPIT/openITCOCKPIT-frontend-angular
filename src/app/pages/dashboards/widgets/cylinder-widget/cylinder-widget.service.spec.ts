import { TestBed } from '@angular/core/testing';

import { CylinderWidgetService } from './cylinder-widget.service';

describe('CylinderWidgetService', () => {
    let service: CylinderWidgetService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CylinderWidgetService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
