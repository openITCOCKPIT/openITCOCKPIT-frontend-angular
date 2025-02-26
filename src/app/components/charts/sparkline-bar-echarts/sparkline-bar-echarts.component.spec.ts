import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SparklineBarApexchartComponent } from './sparkline-bar-apexchart.component';

describe('SparklineBarApexchartComponent', () => {
  let component: SparklineBarApexchartComponent;
  let fixture: ComponentFixture<SparklineBarApexchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SparklineBarApexchartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SparklineBarApexchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
