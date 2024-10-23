import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentconnectorPushComponent } from './agentconnector-push.component';

describe('AgentconnectorPushComponent', () => {
  let component: AgentconnectorPushComponent;
  let fixture: ComponentFixture<AgentconnectorPushComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentconnectorPushComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentconnectorPushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
