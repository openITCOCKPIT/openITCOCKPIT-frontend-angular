import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgSelectOptionCheckboxComponent } from './ng-select-option-checkbox.component';

describe('NgSelectOptionCheckboxComponent', () => {
  let component: NgSelectOptionCheckboxComponent;
  let fixture: ComponentFixture<NgSelectOptionCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgSelectOptionCheckboxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NgSelectOptionCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
