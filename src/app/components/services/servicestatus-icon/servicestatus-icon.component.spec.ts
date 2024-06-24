import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicestatusIconComponent } from './servicestatus-icon.component';

describe('ServicestatusIconComponent', () => {
  let component: ServicestatusIconComponent;
  let fixture: ComponentFixture<ServicestatusIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicestatusIconComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServicestatusIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
