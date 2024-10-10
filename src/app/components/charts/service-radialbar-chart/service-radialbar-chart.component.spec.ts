import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRadialbarChartComponent } from './service-radialbar-chart.component';

describe('ServiceRadialbarChartComponent', () => {
  let component: ServiceRadialbarChartComponent;
  let fixture: ComponentFixture<ServiceRadialbarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceRadialbarChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceRadialbarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
