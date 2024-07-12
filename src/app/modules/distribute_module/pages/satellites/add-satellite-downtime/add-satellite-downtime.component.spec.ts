import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSatelliteDowntimeComponent } from './add-satellite-downtime.component';

describe('AddSatelliteDowntimeComponent', () => {
  let component: AddSatelliteDowntimeComponent;
  let fixture: ComponentFixture<AddSatelliteDowntimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSatelliteDowntimeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSatelliteDowntimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
