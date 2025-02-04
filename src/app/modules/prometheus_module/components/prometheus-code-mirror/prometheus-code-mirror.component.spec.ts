import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrometheusCodeMirrorComponent } from './prometheus-code-mirror.component';

describe('PrometheusCodeMirrorComponent', () => {
  let component: PrometheusCodeMirrorComponent;
  let fixture: ComponentFixture<PrometheusCodeMirrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrometheusCodeMirrorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrometheusCodeMirrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
