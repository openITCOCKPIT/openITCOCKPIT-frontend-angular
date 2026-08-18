import { TestBed } from '@angular/core/testing';

import { HostdependenciesTreeService } from './hostdependencies-tree.service';

describe('HostdependenciesTreeService', () => {
    let service: HostdependenciesTreeService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(HostdependenciesTreeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
