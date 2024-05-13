import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsIndexComponent } from './contacts-index.component';

describe('ContactsIndexComponent', () => {
  let component: ContactsIndexComponent;
  let fixture: ComponentFixture<ContactsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactsIndexComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContactsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
