import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesDowntimeWidgetComponent } from './services-downtime-widget.component';

describe('ServicesDowntimeWidgetComponent', () => {
  let component: ServicesDowntimeWidgetComponent;
  let fixture: ComponentFixture<ServicesDowntimeWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesDowntimeWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesDowntimeWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
