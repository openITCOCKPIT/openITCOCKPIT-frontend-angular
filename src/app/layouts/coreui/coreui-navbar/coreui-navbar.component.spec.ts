import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreuiNavbarComponent } from './coreui-navbar.component';

describe('CoreuiNavbarComponent', () => {
  let component: CoreuiNavbarComponent;
  let fixture: ComponentFixture<CoreuiNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoreuiNavbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CoreuiNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
