import { TestBed } from '@angular/core/testing';

import { AgentconnectorPushService } from './agentconnector-push.service';

describe('AgentconnectorPushService', () => {
    let service: AgentconnectorPushService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AgentconnectorPushService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
