import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceNotificationComponent } from './service-notification.component';

describe('ServiceNotificationComponent', () => {
  let component: ServiceNotificationComponent;
  let fixture: ComponentFixture<ServiceNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
