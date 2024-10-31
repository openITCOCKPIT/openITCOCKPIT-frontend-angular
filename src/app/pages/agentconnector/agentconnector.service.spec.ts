import { TestBed } from '@angular/core/testing';

import { AgentconnectorService } from './agentconnector.service';

describe('AgentconnectorService', () => {
  let service: AgentconnectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentconnectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
