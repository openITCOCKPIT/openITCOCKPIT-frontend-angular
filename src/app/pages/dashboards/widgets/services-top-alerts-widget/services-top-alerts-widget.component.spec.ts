import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesTopAlertsWidgetComponent } from './services-top-alerts-widget.component';

describe('ServicesTopAlertsWidgetComponent', () => {
  let component: ServicesTopAlertsWidgetComponent;
  let fixture: ComponentFixture<ServicesTopAlertsWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesTopAlertsWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesTopAlertsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
