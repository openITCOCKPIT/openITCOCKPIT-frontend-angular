import { TestBed } from '@angular/core/testing';

import { ExportSocketClientService } from './export-socket-client.service';

describe('ExportSocketClientService', () => {
    let service: ExportSocketClientService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ExportSocketClientService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
