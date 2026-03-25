import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SunburstEchartComponent } from './sunburst-echart.component';

describe('SunburstEchartComponent', () => {
  let component: SunburstEchartComponent;
  let fixture: ComponentFixture<SunburstEchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SunburstEchartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SunburstEchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
