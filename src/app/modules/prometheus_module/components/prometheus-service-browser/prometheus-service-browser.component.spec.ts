import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrometheusServiceBrowserComponent } from './prometheus-service-browser.component';

describe('PrometheusServiceBrowserComponent', () => {
  let component: PrometheusServiceBrowserComponent;
  let fixture: ComponentFixture<PrometheusServiceBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrometheusServiceBrowserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrometheusServiceBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
