import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownColorpickerComponent } from './dropdown-colorpicker.component';

describe('DropdownColorpickerComponent', () => {
  let component: DropdownColorpickerComponent;
  let fixture: ComponentFixture<DropdownColorpickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownColorpickerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DropdownColorpickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
