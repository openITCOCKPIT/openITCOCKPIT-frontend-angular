import { TestBed } from '@angular/core/testing';

import { WebSocketsService } from './web-sockets.service';

describe('WebSocketsService', () => {
    let service: WebSocketsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(WebSocketsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
