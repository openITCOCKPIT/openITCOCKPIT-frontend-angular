import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsercontainerrolesIndexComponent } from './usercontainerroles-index.component';

describe('UsercontainerrolesIndexComponent', () => {
  let component: UsercontainerrolesIndexComponent;
  let fixture: ComponentFixture<UsercontainerrolesIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsercontainerrolesIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsercontainerrolesIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
