import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SatellitesDowntimeComponent } from './satellites-downtime.component';

describe('SatellitesDowntimeComponent', () => {
  let component: SatellitesDowntimeComponent;
  let fixture: ComponentFixture<SatellitesDowntimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SatellitesDowntimeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SatellitesDowntimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
