import { TestBed } from '@angular/core/testing';

import { IsarFlowHostsService } from './isar-flow-hosts.service';

describe('IsarFlowHostsService', () => {
    let service: IsarFlowHostsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(IsarFlowHostsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
