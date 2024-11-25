import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntervalPickerComponent } from './interval-picker.component';

describe('IntervalPickerComponent', () => {
  let component: IntervalPickerComponent;
  let fixture: ComponentFixture<IntervalPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntervalPickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntervalPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
