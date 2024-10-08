import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentstatereportPerfdataGaugesComponent } from './currentstatereport-perfdata-gauges.component';

describe('CurrentstatereportPerfdataGaugesComponent', () => {
  let component: CurrentstatereportPerfdataGaugesComponent;
  let fixture: ComponentFixture<CurrentstatereportPerfdataGaugesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentstatereportPerfdataGaugesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentstatereportPerfdataGaugesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
