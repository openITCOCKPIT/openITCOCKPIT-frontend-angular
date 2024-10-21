import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentchecksEditComponent } from './agentchecks-edit.component';

describe('AgentchecksEditComponent', () => {
  let component: AgentchecksEditComponent;
  let fixture: ComponentFixture<AgentchecksEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentchecksEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentchecksEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
