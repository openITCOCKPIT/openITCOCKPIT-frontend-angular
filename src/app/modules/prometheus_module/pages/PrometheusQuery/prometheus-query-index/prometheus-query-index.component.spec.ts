import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrometheusQueryIndexComponent } from './prometheus-query-index.component';

describe('PrometheusQueryIndexComponent', () => {
  let component: PrometheusQueryIndexComponent;
  let fixture: ComponentFixture<PrometheusQueryIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrometheusQueryIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrometheusQueryIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
