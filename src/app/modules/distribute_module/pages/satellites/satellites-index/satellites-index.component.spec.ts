import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SatellitesIndexComponent } from './satellites-index.component';

describe('SatellitesIndexComponent', () => {
  let component: SatellitesIndexComponent;
  let fixture: ComponentFixture<SatellitesIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SatellitesIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SatellitesIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
