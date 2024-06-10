import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostsNotMonitoredComponent } from './hosts-not-monitored.component';

describe('HostsNotMonitoredComponent', () => {
  let component: HostsNotMonitoredComponent;
  let fixture: ComponentFixture<HostsNotMonitoredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostsNotMonitoredComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HostsNotMonitoredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
