import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SatellitesInfoComponent } from './satellites-info.component';

describe('SatellitesInfoComponent', () => {
  let component: SatellitesInfoComponent;
  let fixture: ComponentFixture<SatellitesInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SatellitesInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SatellitesInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
