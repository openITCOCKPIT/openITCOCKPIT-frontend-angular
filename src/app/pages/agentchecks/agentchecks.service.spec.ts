import { TestBed } from '@angular/core/testing';

import { AgentchecksService } from './agentchecks.service';

describe('AgentchecksService', () => {
  let service: AgentchecksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentchecksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
