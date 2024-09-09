import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicePieChartComponent } from './service-pie-chart.component';

describe('ServicePieChartComponent', () => {
  let component: ServicePieChartComponent;
  let fixture: ComponentFixture<ServicePieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicePieChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicePieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
