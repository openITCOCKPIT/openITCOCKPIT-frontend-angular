import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceAddToServicegroupModalComponent } from './service-add-to-servicegroup-modal.component';

describe('ServiceAddToServicegroupModalComponent', () => {
  let component: ServiceAddToServicegroupModalComponent;
  let fixture: ComponentFixture<ServiceAddToServicegroupModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceAddToServicegroupModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceAddToServicegroupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
