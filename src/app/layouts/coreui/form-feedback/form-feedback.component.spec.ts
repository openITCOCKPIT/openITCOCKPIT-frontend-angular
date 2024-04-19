import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFeedbackComponent } from './form-feedback.component';

describe('FormFeedbackComponent', () => {
  let component: FormFeedbackComponent;
  let fixture: ComponentFixture<FormFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFeedbackComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
