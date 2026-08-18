import { TestBed } from '@angular/core/testing';

import { ProxmoxService } from './proxmox.service';

describe('ProxmoxService', () => {
    let service: ProxmoxService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ProxmoxService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
