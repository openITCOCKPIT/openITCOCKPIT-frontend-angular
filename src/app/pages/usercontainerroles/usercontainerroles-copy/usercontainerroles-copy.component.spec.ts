import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsercontainerrolesCopyComponent } from './usercontainerroles-copy.component';

describe('UsercontainerrolesCopyComponent', () => {
  let component: UsercontainerrolesCopyComponent;
  let fixture: ComponentFixture<UsercontainerrolesCopyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsercontainerrolesCopyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsercontainerrolesCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
