import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactgroupsUsedByComponent } from './contactgroups-used-by.component';

describe('ContactgroupsUsedByComponent', () => {
  let component: ContactgroupsUsedByComponent;
  let fixture: ComponentFixture<ContactgroupsUsedByComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactgroupsUsedByComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContactgroupsUsedByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
