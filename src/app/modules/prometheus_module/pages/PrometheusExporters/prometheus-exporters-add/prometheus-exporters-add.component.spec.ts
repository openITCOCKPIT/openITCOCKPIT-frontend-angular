import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrometheusExportersAddComponent } from './prometheus-exporters-add.component';

describe('PrometheusExportersAddComponent', () => {
  let component: PrometheusExportersAddComponent;
  let fixture: ComponentFixture<PrometheusExportersAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrometheusExportersAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrometheusExportersAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
