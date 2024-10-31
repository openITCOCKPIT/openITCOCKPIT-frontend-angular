import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentchecksAddComponent } from './agentchecks-add.component';

describe('AgentchecksAddComponent', () => {
  let component: AgentchecksAddComponent;
  let fixture: ComponentFixture<AgentchecksAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentchecksAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentchecksAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
