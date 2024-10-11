import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentstatereportPerfdataGaugeComponent } from './currentstatereport-perfdata-gauge.component';

describe('CurrentstatereportPerfdataGaugeComponent', () => {
  let component: CurrentstatereportPerfdataGaugeComponent;
  let fixture: ComponentFixture<CurrentstatereportPerfdataGaugeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentstatereportPerfdataGaugeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentstatereportPerfdataGaugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
