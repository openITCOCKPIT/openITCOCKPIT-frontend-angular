import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentconnectorAutoTlsComponent } from './agentconnector-auto-tls.component';

describe('AgentconnectorAutoTlsComponent', () => {
  let component: AgentconnectorAutoTlsComponent;
  let fixture: ComponentFixture<AgentconnectorAutoTlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentconnectorAutoTlsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentconnectorAutoTlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
