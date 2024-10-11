import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordModalComponent } from './reset-password-modal.component';

describe('ResetPasswordModalComponent', () => {
  let component: ResetPasswordModalComponent;
  let fixture: ComponentFixture<ResetPasswordModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetPasswordModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetPasswordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
