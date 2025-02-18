import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostsDowntimeWidgetComponent } from './hosts-downtime-widget.component';

describe('HostsDowntimeWidgetComponent', () => {
  let component: HostsDowntimeWidgetComponent;
  let fixture: ComponentFixture<HostsDowntimeWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostsDowntimeWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostsDowntimeWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
