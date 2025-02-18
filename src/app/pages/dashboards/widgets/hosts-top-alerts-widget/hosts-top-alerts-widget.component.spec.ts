import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostsTopAlertsWidgetComponent } from './hosts-top-alerts-widget.component';

describe('HostsTopAlertsWidgetComponent', () => {
  let component: HostsTopAlertsWidgetComponent;
  let fixture: ComponentFixture<HostsTopAlertsWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostsTopAlertsWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostsTopAlertsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
