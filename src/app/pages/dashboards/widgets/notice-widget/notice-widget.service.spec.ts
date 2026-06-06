import { TestBed } from '@angular/core/testing';

import { NoticeWidgetService } from './notice-widget.service';

describe('NoticeWidgetService', () => {
    let service: NoticeWidgetService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(NoticeWidgetService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
