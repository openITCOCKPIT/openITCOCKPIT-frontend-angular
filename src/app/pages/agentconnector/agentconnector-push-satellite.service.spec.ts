import { TestBed } from '@angular/core/testing';

import { AgentconnectorPushSatelliteService } from './agentconnector-push-satellite.service';

describe('AgentconnectorPushSatelliteService', () => {
    let service: AgentconnectorPushSatelliteService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AgentconnectorPushSatelliteService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
