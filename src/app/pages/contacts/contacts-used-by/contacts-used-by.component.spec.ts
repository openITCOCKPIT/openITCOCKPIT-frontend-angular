import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsUsedByComponent } from './contacts-used-by.component';

describe('ContactsUsedByComponent', () => {
  let component: ContactsUsedByComponent;
  let fixture: ComponentFixture<ContactsUsedByComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactsUsedByComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContactsUsedByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
