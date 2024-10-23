import { TestBed } from '@angular/core/testing';

import { AgentconnectorPullService } from './agentconnector-pull.service';

describe('AgentconnectorPullService', () => {
  let service: AgentconnectorPullService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentconnectorPullService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
