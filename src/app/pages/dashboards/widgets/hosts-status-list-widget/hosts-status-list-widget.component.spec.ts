import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostsStatusListWidgetComponent } from './hosts-status-list-widget.component';

describe('HostsStatusListWidgetComponent', () => {
  let component: HostsStatusListWidgetComponent;
  let fixture: ComponentFixture<HostsStatusListWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostsStatusListWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostsStatusListWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
