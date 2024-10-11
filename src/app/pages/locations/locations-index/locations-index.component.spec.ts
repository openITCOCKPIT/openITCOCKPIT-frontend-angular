import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationsIndexComponent } from './locations-index.component';

describe('LocationsIndexComponent', () => {
  let component: LocationsIndexComponent;
  let fixture: ComponentFixture<LocationsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationsIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
