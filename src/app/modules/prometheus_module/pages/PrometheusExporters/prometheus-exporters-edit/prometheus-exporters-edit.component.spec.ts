import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrometheusExportersEditComponent } from './prometheus-exporters-edit.component';

describe('PrometheusExportersEditComponent', () => {
  let component: PrometheusExportersEditComponent;
  let fixture: ComponentFixture<PrometheusExportersEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrometheusExportersEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrometheusExportersEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
