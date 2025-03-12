import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SatellitesEditComponent } from './satellites-edit.component';

describe('SatellitesEditComponent', () => {
  let component: SatellitesEditComponent;
  let fixture: ComponentFixture<SatellitesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SatellitesEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SatellitesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
