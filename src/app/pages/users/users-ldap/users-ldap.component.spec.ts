import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersLdapComponent } from './users-ldap.component';

describe('UsersLdapComponent', () => {
  let component: UsersLdapComponent;
  let fixture: ComponentFixture<UsersLdapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersLdapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersLdapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
