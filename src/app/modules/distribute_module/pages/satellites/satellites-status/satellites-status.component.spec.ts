import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SatellitesStatusComponent } from './satellites-status.component';

describe('SatellitesStatusComponent', () => {
  let component: SatellitesStatusComponent;
  let fixture: ComponentFixture<SatellitesStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SatellitesStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SatellitesStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
