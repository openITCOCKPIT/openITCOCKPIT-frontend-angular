import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreuiHeaderComponent } from './coreui-header.component';

describe('CoreuiHeaderComponent', () => {
  let component: CoreuiHeaderComponent;
  let fixture: ComponentFixture<CoreuiHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoreuiHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CoreuiHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
