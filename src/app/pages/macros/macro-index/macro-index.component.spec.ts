import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MacroIndexComponent } from './macro-index.component';

describe('MacroIndexComponent', () => {
  let component: MacroIndexComponent;
  let fixture: ComponentFixture<MacroIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MacroIndexComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MacroIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
