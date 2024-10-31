import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsercontainerrolesAddComponent } from './usercontainerroles-add.component';

describe('UsercontainerrolesAddComponent', () => {
  let component: UsercontainerrolesAddComponent;
  let fixture: ComponentFixture<UsercontainerrolesAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsercontainerrolesAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsercontainerrolesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
