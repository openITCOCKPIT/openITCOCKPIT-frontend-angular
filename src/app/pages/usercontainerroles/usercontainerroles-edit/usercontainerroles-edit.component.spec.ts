import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsercontainerrolesEditComponent } from './usercontainerroles-edit.component';

describe('UsercontainerrolesEditComponent', () => {
  let component: UsercontainerrolesEditComponent;
  let fixture: ComponentFixture<UsercontainerrolesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsercontainerrolesEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsercontainerrolesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
