import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceResetChecktimeModalComponent } from './service-reset-checktime-modal.component';

describe('ServiceResetChecktimeModal', () => {
  let component: ServiceResetChecktimeModalComponent;
  let fixture: ComponentFixture<ServiceResetChecktimeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceResetChecktimeModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceResetChecktimeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
