import { TestBed } from '@angular/core/testing';

import { UsergroupsService } from './usergroups.service';

describe('UsergroupsService', () => {
    let service: UsergroupsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(UsergroupsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
