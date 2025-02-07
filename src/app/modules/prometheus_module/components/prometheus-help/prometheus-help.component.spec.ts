import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrometheusHelpComponent } from './prometheus-help.component';

describe('PrometheusHelpComponent', () => {
  let component: PrometheusHelpComponent;
  let fixture: ComponentFixture<PrometheusHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrometheusHelpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrometheusHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
