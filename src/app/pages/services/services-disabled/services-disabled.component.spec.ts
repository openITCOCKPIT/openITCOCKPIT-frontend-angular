import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesDisabledComponent } from './services-disabled.component';

describe('ServicesDisabledComponent', () => {
  let component: ServicesDisabledComponent;
  let fixture: ComponentFixture<ServicesDisabledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesDisabledComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesDisabledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
