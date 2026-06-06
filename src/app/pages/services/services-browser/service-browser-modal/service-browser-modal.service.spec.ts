import { TestBed } from '@angular/core/testing';

import { ServiceBrowserModalService } from './service-browser-modal.service';

describe('ServiceBrowserModalService', () => {
    let service: ServiceBrowserModalService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ServiceBrowserModalService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
