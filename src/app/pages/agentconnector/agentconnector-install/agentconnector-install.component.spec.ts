import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentconnectorInstallComponent } from './agentconnector-install.component';

describe('AgentconnectorInstallComponent', () => {
  let component: AgentconnectorInstallComponent;
  let fixture: ComponentFixture<AgentconnectorInstallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentconnectorInstallComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentconnectorInstallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
