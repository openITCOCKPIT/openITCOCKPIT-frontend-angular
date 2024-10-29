import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentchecksIndexComponent } from './agentchecks-index.component';

describe('AgentchecksIndexComponent', () => {
  let component: AgentchecksIndexComponent;
  let fixture: ComponentFixture<AgentchecksIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentchecksIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentchecksIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
