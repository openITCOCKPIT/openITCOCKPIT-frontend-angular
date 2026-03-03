import { TestBed } from '@angular/core/testing';

import { AutoreportWidgetService } from './autoreport-widget.service';

describe('AutoreportWidgetService', () => {
    let service: AutoreportWidgetService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AutoreportWidgetService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
