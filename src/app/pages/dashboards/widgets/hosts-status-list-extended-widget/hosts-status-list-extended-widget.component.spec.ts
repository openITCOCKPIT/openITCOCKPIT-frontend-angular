import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostsStatusListExtendedWidgetComponent } from './hosts-status-list-extended-widget.component';

describe('HostsStatusListExtendedWidgetComponent', () => {
  let component: HostsStatusListExtendedWidgetComponent;
  let fixture: ComponentFixture<HostsStatusListExtendedWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostsStatusListExtendedWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostsStatusListExtendedWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
