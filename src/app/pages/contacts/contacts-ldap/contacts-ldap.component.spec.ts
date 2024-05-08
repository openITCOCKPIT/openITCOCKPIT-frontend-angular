import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsLdapComponent } from './contacts-ldap.component';

describe('ContactsLdapComponent', () => {
  let component: ContactsLdapComponent;
  let fixture: ComponentFixture<ContactsLdapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactsLdapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContactsLdapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
