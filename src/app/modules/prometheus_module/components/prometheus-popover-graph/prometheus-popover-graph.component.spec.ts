import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrometheusPopoverGraphComponent } from './prometheus-popover-graph.component';

describe('PrometheusPopoverGraphComponent', () => {
  let component: PrometheusPopoverGraphComponent;
  let fixture: ComponentFixture<PrometheusPopoverGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrometheusPopoverGraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrometheusPopoverGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
