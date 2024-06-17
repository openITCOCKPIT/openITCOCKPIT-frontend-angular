import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceAcknowledgeModalComponent } from './service-acknowledge-modal.component';

describe('ServiceAcknowledgeModalComponent', () => {
  let component: ServiceAcknowledgeModalComponent;
  let fixture: ComponentFixture<ServiceAcknowledgeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceAcknowledgeModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceAcknowledgeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
