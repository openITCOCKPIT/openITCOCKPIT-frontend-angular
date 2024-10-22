import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentconnectorWizardProgressbarComponent } from './agentconnector-wizard-progressbar.component';

describe('AgentconnectorWizardProgressbarComponent', () => {
  let component: AgentconnectorWizardProgressbarComponent;
  let fixture: ComponentFixture<AgentconnectorWizardProgressbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentconnectorWizardProgressbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentconnectorWizardProgressbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
