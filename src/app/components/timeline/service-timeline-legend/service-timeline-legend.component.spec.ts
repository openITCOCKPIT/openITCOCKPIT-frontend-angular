import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceTimelineLegendComponent } from './service-timeline-legend.component';

describe('ServiceTimelineLegendComponent', () => {
  let component: ServiceTimelineLegendComponent;
  let fixture: ComponentFixture<ServiceTimelineLegendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceTimelineLegendComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceTimelineLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
