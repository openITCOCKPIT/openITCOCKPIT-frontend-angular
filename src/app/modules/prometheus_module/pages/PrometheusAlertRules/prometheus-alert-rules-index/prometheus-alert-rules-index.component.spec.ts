import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrometheusAlertRulesIndexComponent } from './prometheus-alert-rules-index.component';

describe('PrometheusAlertRulesIndexComponent', () => {
  let component: PrometheusAlertRulesIndexComponent;
  let fixture: ComponentFixture<PrometheusAlertRulesIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrometheusAlertRulesIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrometheusAlertRulesIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
