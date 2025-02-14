import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceAvailabilityOverviewComponent } from './service-availability-overview.component';

describe('ServiceAvailabilityOverviewComponent', () => {
  let component: ServiceAvailabilityOverviewComponent;
  let fixture: ComponentFixture<ServiceAvailabilityOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceAvailabilityOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceAvailabilityOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
