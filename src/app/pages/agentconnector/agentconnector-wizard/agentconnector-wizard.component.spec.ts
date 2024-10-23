import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentconnectorWizardComponent } from './agentconnector-wizard.component';

describe('AgentconnectorWizardComponent', () => {
  let component: AgentconnectorWizardComponent;
  let fixture: ComponentFixture<AgentconnectorWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentconnectorWizardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentconnectorWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
