import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckAttemptsInputComponent } from './check-attempts-input.component';

describe('CheckAttemptsInputComponent', () => {
  let component: CheckAttemptsInputComponent;
  let fixture: ComponentFixture<CheckAttemptsInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckAttemptsInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CheckAttemptsInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
