import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactgroupsEditComponent } from './contactgroups-edit.component';

describe('ContactgroupsEditComponent', () => {
  let component: ContactgroupsEditComponent;
  let fixture: ComponentFixture<ContactgroupsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactgroupsEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContactgroupsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
