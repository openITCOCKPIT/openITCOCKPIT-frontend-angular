import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentconnectorPullComponent } from './agentconnector-pull.component';

describe('AgentconnectorPullComponent', () => {
  let component: AgentconnectorPullComponent;
  let fixture: ComponentFixture<AgentconnectorPullComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentconnectorPullComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentconnectorPullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
