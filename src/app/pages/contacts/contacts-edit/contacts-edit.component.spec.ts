import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsEditComponent } from './contacts-edit.component';

describe('ContactsEditComponent', () => {
  let component: ContactsEditComponent;
  let fixture: ComponentFixture<ContactsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactsEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContactsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
