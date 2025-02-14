import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderTimeComponent } from './slider-time.component';

describe('SliderTimeComponent', () => {
  let component: SliderTimeComponent;
  let fixture: ComponentFixture<SliderTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SliderTimeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SliderTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
