import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartjsGraphComponent } from './chartjs-graph.component';

describe('ChartjsGraphComponent', () => {
  let component: ChartjsGraphComponent;
  let fixture: ComponentFixture<ChartjsGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartjsGraphComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChartjsGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
