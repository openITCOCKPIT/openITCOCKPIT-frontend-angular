import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicePieEchartComponent } from './service-pie-echart.component';

describe('ServicePieEchartComponent', () => {
  let component: ServicePieEchartComponent;
  let fixture: ComponentFixture<ServicePieEchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicePieEchartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicePieEchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
