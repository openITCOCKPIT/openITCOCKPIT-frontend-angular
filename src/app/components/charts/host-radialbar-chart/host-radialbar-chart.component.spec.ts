import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostRadialbarChartComponent } from './host-radialbar-chart.component';

describe('HostRadialbarChartComponent', () => {
  let component: HostRadialbarChartComponent;
  let fixture: ComponentFixture<HostRadialbarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostRadialbarChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostRadialbarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
