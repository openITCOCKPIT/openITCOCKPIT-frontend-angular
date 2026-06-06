import { TestBed } from '@angular/core/testing';

import { ScmWidgetService } from './scm-widget.service';

describe('ScmWidgetService', () => {
    let service: ScmWidgetService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ScmWidgetService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
