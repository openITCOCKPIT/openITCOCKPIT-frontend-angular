import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactgroupsAddComponent } from './contactgroups-add.component';

describe('ContactgroupsAddComponent', () => {
  let component: ContactgroupsAddComponent;
  let fixture: ComponentFixture<ContactgroupsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactgroupsAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContactgroupsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
