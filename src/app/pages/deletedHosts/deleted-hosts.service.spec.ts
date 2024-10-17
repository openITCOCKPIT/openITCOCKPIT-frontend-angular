import { TestBed } from '@angular/core/testing';

import { DeletedHostsService } from './deleted-hosts.service';

describe('DeletedHostsService', () => {
    let service: DeletedHostsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DeletedHostsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
