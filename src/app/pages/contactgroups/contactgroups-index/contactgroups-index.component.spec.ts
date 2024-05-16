import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactgroupsIndexComponent } from './contactgroups-index.component';

describe('ContactgroupsIndexComponent', () => {
  let component: ContactgroupsIndexComponent;
  let fixture: ComponentFixture<ContactgroupsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactgroupsIndexComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContactgroupsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
