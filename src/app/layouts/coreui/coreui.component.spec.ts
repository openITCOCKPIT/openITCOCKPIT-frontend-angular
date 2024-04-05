import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreuiComponent } from './coreui.component';

describe('CoreuiComponent', () => {
  let component: CoreuiComponent;
  let fixture: ComponentFixture<CoreuiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoreuiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CoreuiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
