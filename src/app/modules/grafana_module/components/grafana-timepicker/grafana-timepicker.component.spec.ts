import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrafanaTimepickerComponent } from './grafana-timepicker.component';

describe('GrafanaTimepickerComponent', () => {
  let component: GrafanaTimepickerComponent;
  let fixture: ComponentFixture<GrafanaTimepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrafanaTimepickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrafanaTimepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
